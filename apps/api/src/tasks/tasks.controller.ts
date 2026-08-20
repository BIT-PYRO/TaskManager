import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: Request, @Query() query: QueryTasksDto) {
    const workspaceId = (req as any).user.workspaceId;
    return this.tasksService.findAll(workspaceId, query);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const workspaceId = (req as any).user.workspaceId;
    return this.tasksService.findOne(id, workspaceId);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    const workspaceId = (req as any).user.workspaceId;
    return this.tasksService.create(workspaceId, dto);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const workspaceId = (req as any).user.workspaceId;
    return this.tasksService.update(id, workspaceId, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const workspaceId = (req as any).user.workspaceId;
    return this.tasksService.remove(id, workspaceId);
  }
}
