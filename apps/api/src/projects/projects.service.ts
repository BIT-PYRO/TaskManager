import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
      include: { lead: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, workspaceId },
      include: { lead: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(workspaceId: string, data: any) {
    return this.prisma.project.create({
      data: { ...data, workspaceId },
      include: { lead: true },
    });
  }

  async update(id: string, workspaceId: string, data: any) {
    const existing = await this.prisma.project.findFirst({ where: { id, workspaceId } });
    if (!existing) throw new NotFoundException('Project not found');
    return this.prisma.project.update({
      where: { id },
      data,
      include: { lead: true },
    });
  }

  async remove(id: string, workspaceId: string) {
    const existing = await this.prisma.project.findFirst({ where: { id, workspaceId } });
    if (!existing) throw new NotFoundException('Project not found');
    await this.prisma.project.delete({ where: { id } });
    return { deleted: true };
  }
}
