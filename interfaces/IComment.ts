import type { ObjectId } from 'mongoose';

export interface IComment {
	id: ObjectId | string;
	ticketId: ObjectId | string;
	userId: ObjectId | string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}
