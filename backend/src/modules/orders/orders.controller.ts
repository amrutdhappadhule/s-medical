import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  createOrder(@Request() req, @Body() orderData: any) {
    return this.ordersService.createOrder(req.user.userId, orderData);
  }

  @Get('my-orders')
  getMyOrders(@Request() req) {
    return this.ordersService.getMyOrders(req.user.userId);
  }

  @Get(':id')
  getOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.getOrderById(id, req.user.userId);
  }

  @Put(':id/cancel')
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(id, req.user.userId);
  }

  // Admin routes
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAllOrders(@Query() query: any) {
    return this.ordersService.getAllOrders(query);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }
}
