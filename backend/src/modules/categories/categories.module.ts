import { Module } from '@nestjs/common';
import { MedicinesModule } from '../medicines/medicines.module';
import { Controller, Get } from '@nestjs/common';
import { MedicinesService } from '../medicines/medicines.service';

@Controller('categories')
export class CategoriesController {
  constructor(private medicinesService: MedicinesService) {}

  @Get()
  getCategories() {
    return this.medicinesService.getCategories();
  }
}

@Module({
  imports: [MedicinesModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
