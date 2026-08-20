import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: any) {
    // Check username uniqueness
    if (data.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: data.username, NOT: { id } },
      });
      if (existing) throw new ConflictException('Username already taken');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getWorkspaceMembers(workspaceId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: true },
    });
    return members.map((m) => m.user);
  }
}
