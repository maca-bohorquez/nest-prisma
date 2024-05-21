import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		UserModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "12h" },
		}),
	],
})
export class AppModule {}
