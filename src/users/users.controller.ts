import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from 'src/auth/role.enum';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SuperAdmin, RoleType.Generic)
  async getAllUsers(@Req() request: Request, @Res() response: Response): Promise<any> {
    try {
      const result = await this.userService.getAllUser();
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully fetched data!',
        result: result,
      });
    } catch (err) {
      return response.status(500).json({
        status: 'Error',
        message: 'Internal Server Error!',
      });
    }
  }
}
