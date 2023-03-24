import type { ObjectId } from 'mongoose';

export interface ITicket {
	id: ObjectId | string;
	projectId: ObjectId | string;
	userId: ObjectId | string;
	developerId: ObjectId | string;
	title: string;
	description: string;
	category: Category;
	priority: Priorty;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export enum Category {
	DESIGN = 'DESIGN',
	FEATURE = 'FEATURE',
	BUG = 'BUG',
	SECURITY = 'SECURITY',
}

export enum Priorty {
	LOW = 'LOW',
	MODERATE = 'MODERATE',
	HIGH = 'HIGH',
}
