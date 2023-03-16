import { Schema, model } from 'mongoose';

import ITicket from '../interfaces/ITicket';

const ticketSchema = new Schema<ITicket>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
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
