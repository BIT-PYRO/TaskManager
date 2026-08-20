import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

class CreateSubtaskDto {
  @IsString() title: string;
  @IsOptional() @IsIn(['todo', 'doing', 'completed', 'on_hold']) status?: string;
  @IsOptional() @IsIn(['none', 'urgent', 'high', 'medium', 'low']) priority?: string;
  @IsOptional() @IsString() assigneeId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}

class UpdateSubtaskDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsIn(['todo', 'doing', 'completed', 'on_hold']) status?: string;
  @IsOptional() @IsIn(['none', 'urgent', 'high', 'medium', 'low']) priority?: string;
  @IsOptional() @IsString() assigneeId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class SubtasksController {
  constructor(private subtasksService: SubtasksService) {}

  @Get('tasks/:taskId/subtasks')
  findAll(@Param('taskId') taskId: string) {
    return this.subtasksService.findAll(taskId);
  }

  @Post('tasks/:taskId/subtasks')
  create(@Param('taskId') taskId: string, @Body() dto: CreateSubtaskDto) {
    return this.subtasksService.create(taskId, dto);
  }

  @Patch('subtasks/:id')
  update(@Param('id') id: string, @Body() dto: UpdateSubtaskDto) {
    return this.subtasksService.update(id, dto);
  }

  @Delete('subtasks/:id')
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
