import { UserService } from "./user.service";

import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";

import { CreateUserDto } from "../auth/dto/create-user.dto";
import { LoginUserDto } from "../auth/dto/login-user.dto";
import { Public } from "../common/decorators/public.decorator";
import { ExpressRequestWithUser } from "./interfaces/express-request-with-user.interface";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Public()
	@Post("register")
	registerUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
	@Public()
	@Post("login")
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.userService.login(loginUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get("me")
	me(@Request() req: ExpressRequestWithUser) {
		return req.user;
	}
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.userService.findOne(+id);
	}

	// @Patch(':id')
	// @UseGuards(IsMineGuard)
	// update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
	//   return this.userService.update(+id, updateUserDto);
	// }

	// @Delete(':id')
	// @UseGuards(IsMineGuard)
	// remove(@Param('id') id: string) {
	//   return this.userService.remove(+id);
	// }
}
