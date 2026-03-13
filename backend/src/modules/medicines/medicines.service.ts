import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './medicine.schema';
import { CreateMedicineDto, UpdateMedicineDto } from './medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    prescriptionRequired?: string;
    sortBy?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      prescriptionRequired,
      sortBy = 'name',
      minPrice,
      maxPrice,
    } = query;

    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (prescriptionRequired !== undefined) {
      filter.prescriptionRequired = prescriptionRequired === 'true';
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    let queryBuilder;
    if (search) {
      queryBuilder = this.medicineModel.find({
        ...filter,
        $text: { $search: search },
      });
    } else {
      queryBuilder = this.medicineModel.find(filter);
    }

    // Sorting
    const sortOptions: any = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.name = 1;
    }

    const total = await this.medicineModel.countDocuments(filter);
    const medicines = await queryBuilder
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      medicines,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<MedicineDocument> {
    const medicine = await this.medicineModel.findById(id);
    if (!medicine || !medicine.isActive) {
      throw new NotFoundException('Medicine not found');
    }
    return medicine;
  }

  async findByCategory(category: string): Promise<MedicineDocument[]> {
    return this.medicineModel
      .find({ category, isActive: true })
      .limit(8)
      .exec();
  }

  async create(createDto: CreateMedicineDto): Promise<MedicineDocument> {
    const medicine = new this.medicineModel(createDto);
    return medicine.save();
  }

  async update(
    id: string,
    updateDto: UpdateMedicineDto,
  ): Promise<MedicineDocument> {
    const medicine = await this.medicineModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true },
    );
    if (!medicine) throw new NotFoundException('Medicine not found');
    return medicine;
  }

  async delete(id: string): Promise<void> {
    const medicine = await this.medicineModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!medicine) throw new NotFoundException('Medicine not found');
  }

  async updateStock(id: string, stock: number): Promise<MedicineDocument> {
    const medicine = await this.medicineModel.findByIdAndUpdate(
      id,
      { $set: { stock } },
      { new: true },
    );
    if (!medicine) throw new NotFoundException('Medicine not found');
    return medicine;
  }

  async getLowStockMedicines(threshold = 10): Promise<MedicineDocument[]> {
    return this.medicineModel
      .find({ stock: { $lte: threshold }, isActive: true })
      .sort({ stock: 1 })
      .exec();
  }

  async getCategories(): Promise<string[]> {
    return this.medicineModel.distinct('category', { isActive: true });
  }

  async getAdminMedicines() {
    return this.medicineModel.find({ isActive: true }).sort({ createdAt: -1 });
  }
}
