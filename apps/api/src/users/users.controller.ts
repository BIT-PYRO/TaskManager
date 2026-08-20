import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

class UpdateUserDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) name?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(50) username?: string;
  @IsOptional() @IsString() @MaxLength(100) title?: string;
  @IsOptional() @IsString() avatarUrl?: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    return this.usersService.findOne((req as any).user.sub);
  }

  @Patch('me')
  updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    return this.usersService.update((req as any).user.sub, dto);
  }

  @Get('workspace-members')
  getWorkspaceMembers(@Req() req: Request) {
    return this.usersService.getWorkspaceMembers((req as any).user.workspaceId);
  }
}
