import type { User } from './user';

export interface Project {
	id: string;
	name: string;
	description: string;
	manager: User;
	managersName: string;
	owner: User;
	createdAt: Date;
	updatedAt: Date;
}
