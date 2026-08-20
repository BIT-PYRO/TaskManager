import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async create(workspaceId: string, name: string, color: string) {
    return this.prisma.label.create({
      data: { workspaceId, name, color },
    });
  }
}
