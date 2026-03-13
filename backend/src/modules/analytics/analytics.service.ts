import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/order.schema';
import { Medicine, MedicineDocument } from '../medicines/medicine.schema';
import { User, UserDocument } from '../users/user.schema';
import { Prescription, PrescriptionDocument } from '../prescriptions/prescription.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  async getDashboardStats() {
    const [
      totalOrders,
      totalMedicines,
      totalCustomers,
      pendingPrescriptions,
      lowStockMedicines,
      todayOrders,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.medicineModel.countDocuments({ isActive: true }),
      this.userModel.countDocuments({ role: 'customer' }),
      this.prescriptionModel.countDocuments({ status: 'pending' }),
      this.medicineModel.countDocuments({ stock: { $lte: 10 }, isActive: true }),
      this.orderModel.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
    ]);

    const totalSalesResult = await this.orderModel.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);

    const totalSales = totalSalesResult[0]?.total || 0;

    return {
      totalOrders,
      totalSales,
      totalMedicines,
      totalCustomers,
      pendingPrescriptions,
      lowStockMedicines,
      todayOrders,
    };
  }

  async getDailySales(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['cancelled'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalSales: { $sum: '$finalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = sales.find((s) => s._id === dateStr);
      result.push({
        date: dateStr,
        totalSales: existing?.totalSales || 0,
        totalOrders: existing?.totalOrders || 0,
      });
    }

    return result;
  }

  async getTopSellingMedicines(limit = 10) {
    return this.medicineModel
      .find({ isActive: true })
      .sort({ totalSold: -1 })
      .limit(limit)
      .select('name category price totalSold stock');
  }

  async getMonthlySales() {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    return this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['cancelled'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          totalSales: { $sum: '$finalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getCategoryStats() {
    return this.orderModel.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'medicines',
          localField: 'items.medicine',
          foreignField: '_id',
          as: 'medicine',
        },
      },
      { $unwind: '$medicine' },
      {
        $group: {
          _id: '$medicine.category',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
  }
}
