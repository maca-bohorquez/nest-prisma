
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login-user.dto';

import * as bcrypt from 'bcrypt';
import { RegisterUsersDto } from './dto/register-user.dto';
import { Users } from 'src/users/users.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly PrismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService) {}


  async login(LoginDto: LoginDto): Promise<any>{
    const {username,password} = LoginDto

    const users = await this.PrismaService.user.findUnique({
      where: {username}
    })

    if(!users){
      throw new NotFoundException('user not found')
    }

    const validatePassword = await bcrypt.compare(password,users.password)

    if(!validatePassword){
      throw new NotFoundException('password is incorrect')
    }

    return {
      token: this.jwtService.sign(username)
    }
  }


  async register (createDto: RegisterUsersDto): Promise<any>{
    const createUser = new Users();
  createUser.name = createDto.name;
  createUser.email = createDto.email;
  createUser.username = createDto.username;
  createUser.password = await bcrypt.hash(createDto.password, 10);

  const user = await this.usersService.createUser(createUser);

    return {
      token: this.jwtService.sign({ username: user.username }),
    };
  }



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
