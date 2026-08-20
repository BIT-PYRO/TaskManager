import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private taskIncludes = {
    members: {
      include: { user: true },
    },
    labels: {
      include: { label: true },
    },
    reporter: true,
    team: true,
    project: {
      select: { id: true, name: true },
    },
  };

  async findAll(workspaceId: string, query: QueryTasksDto) {
    const where: any = { workspaceId };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.projectId) where.projectId = query.projectId;
    if (query.teamId) where.teamId = query.teamId;
    if (query.reporterId) where.reporterId = query.reporterId;

    if (query.assigneeId) {
      where.members = { some: { userId: query.assigneeId } };
    }

    if (query.labelId) {
      where.labels = { some: { labelId: query.labelId } };
    }

    return this.prisma.task.findMany({
      where,
      include: this.taskIncludes,
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string, workspaceId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, workspaceId },
      include: this.taskIncludes,
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(workspaceId: string, dto: CreateTaskDto) {
    const { memberIds, labelIds, ...data } = dto;

    const task = await this.prisma.task.create({
      data: {
        ...data,
        workspaceId,
        members: memberIds?.length
          ? { create: memberIds.map((userId) => ({ userId })) }
          : undefined,
        labels: labelIds?.length
          ? { create: labelIds.map((labelId) => ({ labelId })) }
          : undefined,
      },
      include: this.taskIncludes,
    });

    return task;
  }

  async update(id: string, workspaceId: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findFirst({
      where: { id, workspaceId },
    });
    if (!existing) throw new NotFoundException('Task not found');

    const { memberIds, labelIds, ...data } = dto;

    // Handle member updates
    if (memberIds !== undefined) {
      await this.prisma.taskMember.deleteMany({ where: { taskId: id } });
      if (memberIds.length > 0) {
        await this.prisma.taskMember.createMany({
          data: memberIds.map((userId) => ({ taskId: id, userId })),
        });
      }
    }

    // Handle label updates
    if (labelIds !== undefined) {
      await this.prisma.taskLabel.deleteMany({ where: { taskId: id } });
      if (labelIds.length > 0) {
        await this.prisma.taskLabel.createMany({
          data: labelIds.map((labelId) => ({ taskId: id, labelId })),
        });
      }
    }

    return this.prisma.task.update({
      where: { id },
      data,
      include: this.taskIncludes,
    });
  }

  async remove(id: string, workspaceId: string) {
    const existing = await this.prisma.task.findFirst({
      where: { id, workspaceId },
    });
    if (!existing) throw new NotFoundException('Task not found');

    await this.prisma.task.delete({ where: { id } });
    return { deleted: true };
  }
}
