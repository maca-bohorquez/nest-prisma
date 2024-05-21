import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RoleType } from "./role.enum";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";
import { RolesService } from "./roles.service";

@Controller("roles")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	@Roles(RoleType.SuperAdmin)
	create(@Body() createRoleDto: any) {
		return this.rolesService.create(createRoleDto);
	}

	@Get()
	@Roles(RoleType.SuperAdmin, RoleType.Generic)
	findAll() {
		return this.rolesService.findAll();
	}

	@Get(":id")
	@Roles(RoleType.SuperAdmin, RoleType.Generic)
	findOne(@Param("id") id: string) {
		return this.rolesService.findOne(+id);
	}

	@Patch(":id")
	@Roles(RoleType.SuperAdmin)
	update(@Param("id") id: string, @Body() updateRoleDto: any) {
		return this.rolesService.update(+id, updateRoleDto);
	}

	@Delete(":id")
	@Roles(RoleType.SuperAdmin)
	remove(@Param("id") id: string) {
		return this.rolesService.remove(+id);
	}
}
