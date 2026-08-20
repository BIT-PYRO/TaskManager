import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString } from 'class-validator';

class CreateTeamDto {
  @IsString() name: string;
}

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.teamsService.findAll((req as any).user.workspaceId);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTeamDto) {
    return this.teamsService.create((req as any).user.workspaceId, dto.name);
  }
}
