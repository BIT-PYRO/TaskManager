import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(taskId: string) {
    return this.prisma.subtask.findMany({
      where: { taskId },
      include: { assignee: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(taskId: string, data: any) {
    return this.prisma.subtask.create({
      data: { ...data, taskId },
      include: { assignee: true },
    });
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.subtask.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subtask not found');
    return this.prisma.subtask.update({
      where: { id },
      data,
      include: { assignee: true },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.subtask.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subtask not found');
    await this.prisma.subtask.delete({ where: { id } });
    return { deleted: true };
  }
}
