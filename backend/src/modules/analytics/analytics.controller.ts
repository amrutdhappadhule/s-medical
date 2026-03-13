import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('daily-sales')
  getDailySales(@Query('days') days: number) {
    return this.analyticsService.getDailySales(days || 7);
  }

  @Get('monthly-sales')
  getMonthlySales() {
    return this.analyticsService.getMonthlySales();
  }

  @Get('top-medicines')
  getTopMedicines(@Query('limit') limit: number) {
    return this.analyticsService.getTopSellingMedicines(limit || 10);
  }

  @Get('category-stats')
  getCategoryStats() {
    return this.analyticsService.getCategoryStats();
  }
}
