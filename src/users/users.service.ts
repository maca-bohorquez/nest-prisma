import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async savePasswordResetToken(userId: number, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordResetToken: token },
    });
  }

  async findUserIdByPasswordResetToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { passwordResetToken: token },
    });
    return user ? user.id : null;
  }

  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async deletePasswordResetToken(token: string) {
    await this.prisma.user.updateMany({
      where: { passwordResetToken: token },
      data: { passwordResetToken: null },
    });
  }

  async getAllUser() {
    return this.prisma.user.findMany();
  }
}


