import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MedicineDocument = Medicine & Document;

@Schema({ timestamps: true })
export class Medicine {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ trim: true })
  composition: string;

  @Prop({ trim: true })
  manufacturer: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop()
  expiryDate: Date;

  @Prop()
  batchNumber: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  prescriptionRequired: boolean;

  @Prop()
  imageUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  totalSold: number;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);

// Text index for search
MedicineSchema.index({ name: 'text', composition: 'text', manufacturer: 'text' });
