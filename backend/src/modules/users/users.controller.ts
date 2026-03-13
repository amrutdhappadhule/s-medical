import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateDto);
  }

  @Post('addresses')
  addAddress(@Request() req, @Body() address: any) {
    return this.usersService.addAddress(req.user.userId, address);
  }

  @Delete('addresses/:index')
  removeAddress(@Request() req, @Param('index') index: string) {
    return this.usersService.removeAddress(req.user.userId, parseInt(index));
  }

  @Put('change-password')
  changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      body.currentPassword,
      body.newPassword,
    );
  }

  // Admin routes
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
