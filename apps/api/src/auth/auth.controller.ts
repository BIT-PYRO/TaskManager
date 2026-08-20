import { Controller, Post, Get, Res, Req, UseGuards, HttpCode } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('guest')
  @HttpCode(200)
  async guestLogin(@Res({ passthrough: true }) res: Response) {
    const { token, user, workspaceId } = await this.authService.guestLogin();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return { user, workspaceId };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    const userId = (req as any).user.sub;
    const me = await this.authService.getMe(userId);
    if (!me) {
      return { user: null };
    }
    return me;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { path: '/' });
    return { success: true };
  }
}
