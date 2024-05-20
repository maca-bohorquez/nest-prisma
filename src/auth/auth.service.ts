
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,  // Asegúrate de implementar el servicio de correo
  ) {}

  async requestResetPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const token = uuidv4(); // Generate an unique token for password recovery
    // Save the token in the database
    await this.usersService.savePasswordResetToken(user.id, token);

    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;
    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.usersService.findUserIdByPasswordResetToken(token);
    if (!userId) {
      throw new Error('Invalid or expired password reset token');
    }

    await this.usersService.updatePassword(userId, newPassword);
    // Delete the token after use it 
    await this.usersService.deletePasswordResetToken(token);
  }
}
