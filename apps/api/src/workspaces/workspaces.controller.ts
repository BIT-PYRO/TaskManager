import { Controller, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Delete(':id/leave')
  leave(@Req() req: Request, @Param('id') id: string) {
    return this.workspacesService.leaveWorkspace(id, (req as any).user.sub);
  }
}
