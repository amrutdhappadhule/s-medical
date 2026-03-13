import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto, UpdateMedicineDto, UpdateStockDto } from './medicine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.medicinesService.findAll(query);
  }

  @Get('categories')
  getCategories() {
    return this.medicinesService.getCategories();
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getLowStock(@Query('threshold') threshold: number) {
    return this.medicinesService.getLowStockMedicines(threshold);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminMedicines() {
    return this.medicinesService.getAdminMedicines();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createDto: CreateMedicineDto) {
    return this.medicinesService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateDto: UpdateMedicineDto) {
    return this.medicinesService.update(id, updateDto);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStock(@Param('id') id: string, @Body() stockDto: UpdateStockDto) {
    return this.medicinesService.updateStock(id, stockDto.stock);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.medicinesService.delete(id);
  }
}
