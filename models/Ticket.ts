import { Schema, model } from 'mongoose';

import { ITicket, Category, Priorty } from '../interfaces/ITicket';

const ticketSchema = new Schema<ITicket>(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Project',
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		developerId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			enum: Category,
		},
		priority: {
			type: String,
			enum: Priorty,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export default model<ITicket>('Ticket', ticketSchema);
