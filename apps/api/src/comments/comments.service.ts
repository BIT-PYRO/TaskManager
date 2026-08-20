import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(taskId: string, authorId: string, content: string) {
    return this.prisma.comment.create({
      data: { taskId, authorId, content },
      include: { author: true },
    });
  }
}
