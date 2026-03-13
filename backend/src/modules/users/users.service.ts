import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, password } = createUserDto;

    // Check existing user
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isActive: true });
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateDto }, { new: true })
      .select('-password');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addAddress(userId: string, address: any): Promise<UserDocument> {
    // If default, unset other defaults
    if (address.isDefault) {
      await this.userModel.updateOne(
        { _id: userId },
        { $set: { 'addresses.$[].isDefault': false } },
      );
    }

    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { addresses: address } },
        { new: true },
      )
      .select('-password');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async removeAddress(userId: string, addressIndex: number): Promise<UserDocument> {
    const user = await this.findById(userId);
    user.addresses.splice(addressIndex, 1);
    await this.userModel.findByIdAndUpdate(userId, { addresses: user.addresses });
    return this.findById(userId);
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ConflictException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
  }
}
