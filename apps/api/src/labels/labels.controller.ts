import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { LabelsService } from './labels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional } from 'class-validator';

class CreateLabelDto {
  @IsString() name: string;
  @IsOptional() @IsString() color?: string;
}

@Controller('labels')
@UseGuards(JwtAuthGuard)
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.labelsService.findAll((req as any).user.workspaceId);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateLabelDto) {
    return this.labelsService.create(
      (req as any).user.workspaceId,
      dto.name,
      dto.color || '#6B7280',
    );
  }
}
