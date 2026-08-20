import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async leaveWorkspace(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this workspace');
    }

    // Check if user is the only owner
    if (membership.role === 'owner') {
      const otherOwners = await this.prisma.workspaceMember.count({
        where: { workspaceId, role: 'owner', NOT: { userId } },
      });
      if (otherOwners === 0) {
        const totalMembers = await this.prisma.workspaceMember.count({
          where: { workspaceId },
        });
        if (totalMembers === 1) {
          // Last member - delete workspace
          await this.prisma.workspace.delete({ where: { id: workspaceId } });
          return { deleted: true, message: 'Workspace deleted as you were the last member' };
        }
        throw new BadRequestException(
          'You are the only owner. Transfer ownership before leaving.',
        );
      }
    }

    await this.prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    return { left: true };
  }
}
