import type { ObjectId } from 'mongoose';

export interface ITeam {
	id: ObjectId | string;
	name: string;
	description: string;
	logo: Buffer;
	userId: ObjectId | string;
	createdAt: Date;
	updatedAt: Date;
}
