export interface JwtPayload {
	username: string;
	sub: number; // User ID
	role: string;
}
