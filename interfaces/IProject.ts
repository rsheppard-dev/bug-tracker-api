import type { ObjectId } from 'mongoose';

export interface IProject {
	id: ObjectId | string;
	teamId: ObjectId | string;
	userId: ObjectId | string;
	testers: ObjectId[] | string[];
	developers: ObjectId[] | string[];
	name: string;
	description: string;
	image: Buffer;
	archived: boolean;
	createdAt: Date;
	updatedAt: Date;
}
