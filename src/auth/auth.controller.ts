
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-reset-password')
  @HttpCode(HttpStatus.OK)
  async requestResetPassword(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    await this.authService.requestResetPassword(requestResetPasswordDto.email);
    return { message: 'Password reset link sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return { message: 'Password successfully reset' };
  }
}
