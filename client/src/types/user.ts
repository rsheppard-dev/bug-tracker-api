export interface User {
	_id: string;
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
	sessionId: string;
}

export enum Role {
	TESTER = 'TESTER',
	DEVELOPER = 'DEVELOPER',
	MANAGER = 'MANAGER',
	ADMIN = 'ADMIN',
}
