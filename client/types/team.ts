import type { User } from './user';

export interface Team {
	id: string;
	name: string;
	description: string;
	logo: {
		contentType: string;
		data: any;
	};
	owner: User;
	createdAt: Date;
	updatedAt: Date;
}
