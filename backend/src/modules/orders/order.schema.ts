import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PLACED = 'placed',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  PAY_AT_STORE = 'pay_at_store',
  ONLINE = 'online',
}

export enum DeliveryType {
  HOME_DELIVERY = 'home_delivery',
  STORE_PICKUP = 'store_pickup',
}

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Medicine', required: true })
  medicine: Types.ObjectId;

  @Prop({ required: true })
  medicineName: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({
    type: [
      {
        medicine: { type: Types.ObjectId, ref: 'Medicine' },
        medicineName: String,
        quantity: Number,
        price: Number,
      },
    ],
  })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  deliveryCharge: number;

  @Prop({ required: true })
  finalAmount: number;

  @Prop({ enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ enum: DeliveryType, required: true })
  deliveryType: DeliveryType;

  @Prop({ enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;

  @Prop({ type: Object })
  deliveryAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };

  @Prop()
  notes: string;

  @Prop()
  prescriptionId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
