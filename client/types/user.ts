export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	roles: {
		team: string;
		role: Role;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

export enum Role {
	TESTER = 'TESTER',
	DEVELOPER = 'DEVELOPER',
	MANAGER = 'MANAGER',
	ADMIN = 'ADMIN',
}
