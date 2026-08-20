import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

class CreateProjectDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsIn(['none', 'urgent', 'high', 'medium', 'low']) priority?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}

class UpdateProjectDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsIn(['none', 'urgent', 'high', 'medium', 'low']) priority?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.projectsService.findAll((req as any).user.workspaceId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.projectsService.findOne(id, (req as any).user.workspaceId);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateProjectDto) {
    return this.projectsService.create((req as any).user.workspaceId, dto);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, (req as any).user.workspaceId, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.projectsService.remove(id, (req as any).user.workspaceId);
  }
}
