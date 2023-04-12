import type { User } from './user';

export interface Team {
	id: string;
	name: string;
	description: string;
	logo: string;
	owner: User;
	createdAt: Date;
	updatedAt: Date;
}
