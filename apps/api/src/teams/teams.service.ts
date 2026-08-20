import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.team.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async create(workspaceId: string, name: string) {
    return this.prisma.team.create({
      data: { workspaceId, name },
    });
  }
}
