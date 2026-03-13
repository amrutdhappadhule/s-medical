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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PrescriptionStatus } from './prescription.schema';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    // In production, upload to Cloudinary
    // For demo, use a placeholder URL
    const imageUrl = file
      ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      : body.imageUrl || 'https://placeholder.com/prescription.jpg';

    return this.prescriptionsService.create(req.user.userId, {
      imageUrl,
      publicId: `prescription_${Date.now()}`,
      doctorName: body.doctorName,
      patientName: body.patientName,
      notes: body.notes,
    });
  }

  @Get('my')
  getMyPrescriptions(@Request() req) {
    return this.prescriptionsService.getMyPrescriptions(req.user.userId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.prescriptionsService.getPrescriptionById(id);
  }

  // Admin routes
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAll(@Query() query: any) {
    return this.prescriptionsService.getAllPrescriptions(query);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: PrescriptionStatus; rejectionReason?: string },
  ) {
    return this.prescriptionsService.updateStatus(
      id,
      body.status,
      body.rejectionReason,
    );
  }
}
