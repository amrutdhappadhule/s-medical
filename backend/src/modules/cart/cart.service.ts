import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.medicine');

    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
      await cart.save();
    }

    return cart;
  }

  async addItem(userId: string, medicineId: string, quantity: number) {
    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.medicine.toString() === medicineId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ medicine: medicineId as any, quantity });
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateItem(userId: string, medicineId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) return this.getCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.medicine.toString() === medicineId,
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, medicineId: string) {
    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { medicine: medicineId } } },
    );
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
    );
  }

  async getCartCount(userId: string): Promise<number> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
