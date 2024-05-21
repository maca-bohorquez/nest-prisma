import { Injectable, NotFoundException } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

import { UserService } from "../user/user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async login(LoginDto: LoginUserDto): Promise<any> {
		const { email, password } = LoginDto;

		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new NotFoundException("user not found");
		}

		const validatePassword = await bcrypt.compare(password, user.password);

		if (!validatePassword) {
			throw new NotFoundException("password is incorrect");
		}

		return {
			token: this.jwtService.sign({
				username: user.username,
				email: user.email,
			}),
		};
	}

	async register(createDto: CreateUserDto): Promise<any> {
		const user = await this.userService.create(createDto);

		return {
			token: this.jwtService.sign({
				username: user.username,
				email: user.email,
			}),
		};
	}
}
