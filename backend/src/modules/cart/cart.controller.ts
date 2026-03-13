import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  addItem(
    @Request() req,
    @Body() body: { medicineId: string; quantity: number },
  ) {
    return this.cartService.addItem(
      req.user.userId,
      body.medicineId,
      body.quantity || 1,
    );
  }

  @Put('update')
  updateItem(
    @Request() req,
    @Body() body: { medicineId: string; quantity: number },
  ) {
    return this.cartService.updateItem(
      req.user.userId,
      body.medicineId,
      body.quantity,
    );
  }

  @Delete('remove/:medicineId')
  removeItem(@Request() req, @Param('medicineId') medicineId: string) {
    return this.cartService.removeItem(req.user.userId, medicineId);
  }

  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
