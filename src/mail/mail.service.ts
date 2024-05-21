import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
	private transporter;

	constructor(private readonly configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: this.configService.get<string>("EMAIL_USER"),
				pass: this.configService.get<string>("EMAIL_PASS"),
			},
		});
	}

	async sendPasswordResetEmail(email: string, resetUrl: string) {
		await this.transporter.sendMail({
			from: this.configService.get<string>("EMAIL_USER"),
			to: email,
			subject: "Password Reset",
			html: `Click <a href="${resetUrl}">here</a> to reset your password`,
		});
	}
}
