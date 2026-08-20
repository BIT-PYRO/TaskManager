import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString } from 'class-validator';

class CreateCommentDto {
  @IsString() content: string;
}

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findAll(taskId);
  }

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.sub;
    return this.commentsService.create(taskId, userId, dto.content);
  }
}
