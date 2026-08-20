import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { PreferencesService } from './preferences.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, IsObject } from 'class-validator';

class UpdatePreferencesDto {
  @IsOptional() @IsString() theme?: string;
  @IsOptional() @IsString() colorMode?: string;
  @IsOptional() @IsString() taskView?: string;
  @IsOptional() @IsObject() visibleFields?: Record<string, boolean>;
}

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @Get()
  get(@Req() req: Request) {
    return this.preferencesService.get((req as any).user.sub);
  }

  @Patch()
  update(@Req() req: Request, @Body() dto: UpdatePreferencesDto) {
    return this.preferencesService.update((req as any).user.sub, dto);
  }
}
