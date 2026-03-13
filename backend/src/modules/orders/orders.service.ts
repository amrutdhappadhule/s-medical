import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './order.schema';
import { CartService } from '../cart/cart.service';
import { MedicinesService } from '../medicines/medicines.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private medicinesService: MedicinesService,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SM${timestamp.slice(-6)}${random}`;
  }

  async createOrder(userId: string, orderData: any): Promise<OrderDocument> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Build order items from cart
    const items = [];
    let totalAmount = 0;

    for (const cartItem of cart.items as any[]) {
      const medicine = cartItem.medicine;
      if (!medicine) continue;

      if (medicine.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${medicine.name}`,
        );
      }

      const itemTotal = medicine.price * cartItem.quantity;
      totalAmount += itemTotal;

      items.push({
        medicine: medicine._id,
        medicineName: medicine.name,
        quantity: cartItem.quantity,
        price: medicine.price,
      });
    }

    const deliveryCharge =
      orderData.deliveryType === 'home_delivery' && totalAmount < 500 ? 50 : 0;
    const finalAmount = totalAmount + deliveryCharge;

    const order = new this.orderModel({
      user: userId,
      orderNumber: this.generateOrderNumber(),
      items,
      totalAmount,
      deliveryCharge,
      finalAmount,
      paymentMethod: orderData.paymentMethod,
      deliveryType: orderData.deliveryType,
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes,
      prescriptionId: orderData.prescriptionId,
    });

    await order.save();

    // Update medicine stock
    for (const item of items) {
      const medicine = await this.medicinesService.findById(
        item.medicine.toString(),
      );
      await this.medicinesService.updateStock(
        item.medicine.toString(),
        medicine.stock - item.quantity,
      );

      // Update totalSold
      await this.medicinesService['medicineModel']?.findByIdAndUpdate(
        item.medicine,
        { $inc: { totalSold: item.quantity } },
      );
    }

    // Clear cart after order
    await this.cartService.clearCart(userId);

    return order.populate('items.medicine');
  }

  async getMyOrders(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ user: userId })
      .populate('items.medicine')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderById(orderId: string, userId?: string): Promise<OrderDocument> {
    const filter: any = { _id: orderId };
    if (userId) filter.user = userId;

    const order = await this.orderModel
      .findOne(filter)
      .populate('items.medicine')
      .populate('user', 'name email phone');

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getAllOrders(query: any) {
    const { page = 1, limit = 20, status } = query;
    const filter: any = {};
    if (status) filter.status = status;

    const total = await this.orderModel.countDocuments(filter);
    const orders = await this.orderModel
      .find(filter)
      .populate('user', 'name email phone')
      .populate('items.medicine', 'name price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { orders, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) } };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancelOrder(orderId: string, userId: string): Promise<OrderDocument> {
    const order = await this.getOrderById(orderId, userId);

    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    // Restore stock
    for (const item of order.items as any[]) {
      const medicine = await this.medicinesService.findById(item.medicine._id.toString());
      await this.medicinesService.updateStock(
        item.medicine._id.toString(),
        medicine.stock + item.quantity,
      );
    }

    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status: OrderStatus.CANCELLED },
      { new: true },
    );
  }
}
