import { Schema, model } from 'mongoose';

import type { IComment } from '../interfaces/IComment';

const commentSchema = new Schema<IComment>(
	{
		content: {
			type: String,
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		ticketId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Ticket',
		},
	},
	{
		timestamps: true,
	}
);

export default model<IComment>('Comment', commentSchema);
