import type { ObjectId } from 'mongoose';

export interface IUser {
	id: ObjectId | string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	roles: [
		{
			teamId: ObjectId | string;
			role: Role[];
		}
	];
	createdAt: Date;
	updatedAt: Date;
}

export enum Role {
	TESTER = 'TESTER',
	DEVELOPER = 'DEVELOPER',
	MANAGER = 'MANAGER',
	ADMIN = 'ADMIN',
}
