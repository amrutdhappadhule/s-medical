import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Prescription,
  PrescriptionDocument,
  PrescriptionStatus,
} from './prescription.schema';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  async create(userId: string, data: {
    imageUrl: string;
    publicId: string;
    doctorName?: string;
    patientName?: string;
    notes?: string;
  }): Promise<PrescriptionDocument> {
    const prescription = new this.prescriptionModel({
      user: userId,
      ...data,
    });
    return prescription.save();
  }

  async getMyPrescriptions(userId: string): Promise<PrescriptionDocument[]> {
    return this.prescriptionModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllPrescriptions(query: any) {
    const { page = 1, limit = 20, status } = query;
    const filter: any = {};
    if (status) filter.status = status;

    const total = await this.prescriptionModel.countDocuments(filter);
    const prescriptions = await this.prescriptionModel
      .find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      prescriptions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(
    prescriptionId: string,
    status: PrescriptionStatus,
    rejectionReason?: string,
  ): Promise<PrescriptionDocument> {
    const prescription = await this.prescriptionModel.findByIdAndUpdate(
      prescriptionId,
      { $set: { status, rejectionReason } },
      { new: true },
    );
    if (!prescription) throw new NotFoundException('Prescription not found');
    return prescription;
  }

  async getPrescriptionById(id: string): Promise<PrescriptionDocument> {
    const prescription = await this.prescriptionModel
      .findById(id)
      .populate('user', 'name email phone');
    if (!prescription) throw new NotFoundException('Prescription not found');
    return prescription;
  }
}
