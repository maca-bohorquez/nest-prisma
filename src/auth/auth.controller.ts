
import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express'
import { RegisterUsersDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}


  @Post('/login')
  async login(@Req() request:Request, @Res() response :Response, @Body() loginDto: LoginDto):Promise<any>{
       try{
           const result = await this.authService.login(loginDto);
           return response.status(200).json({
            status: 'Ok!',
            message: 'Successfully login!',
            result: result
           })

       }catch(err){
            return response.status(500).json({
                 status: 'Error!',
                 message: 'Internal Server Error!',
                })
       }
  }

  @Post('/register')
  async register(@Req() request:Request, @Res() response :Response, @Body() registerDto: RegisterUsersDto):Promise<any>{
       try {
            const result = await this.authService.register(registerDto);
            return response.status(200).json({
              status: 'Ok!',
              message: 'Successfully register user!',
              result: result,
            });
          } catch (err) {
            console.log(err)
            return response.status(500).json({
              status: 'Error!',
              message: 'Internal Server Error!',
            });
          }
        }



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
