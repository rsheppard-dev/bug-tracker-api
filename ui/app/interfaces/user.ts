export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
	session: string;
	iat: number;
	exp: number;
}
