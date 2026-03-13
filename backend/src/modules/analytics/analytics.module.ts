import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Order, OrderSchema } from '../orders/order.schema';
import { Medicine, MedicineSchema } from '../medicines/medicine.schema';
import { User, UserSchema } from '../users/user.schema';
import { Prescription, PrescriptionSchema } from '../prescriptions/prescription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Medicine.name, schema: MedicineSchema },
      { name: User.name, schema: UserSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
