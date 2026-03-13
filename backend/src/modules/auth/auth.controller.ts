import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/user.schema';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user.userId);
  }

  /**
   * One-time setup endpoint to create admin if none exists.
   * Call: POST /api/auth/setup-admin
   * Safe: only works if NO admin exists in DB yet.
   */
  @Post('setup-admin')
  async setupAdmin() {
    const existingAdmin = await this.userModel.findOne({ role: UserRole.ADMIN });
    if (existingAdmin) {
      return { message: 'Admin already exists', email: existingAdmin.email };
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await this.userModel.create({
      name: 'Swami Medical Admin',
      email: 'admin@swamimedical.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      phone: '+91 98765 43210',
      isActive: true,
    });

    return {
      message: '✅ Admin created successfully!',
      credentials: {
        email: 'admin@swamimedical.com',
        password: 'Admin@123',
      },
    };
  }
}
