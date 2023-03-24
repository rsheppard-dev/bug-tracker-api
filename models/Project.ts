import { Schema, model } from 'mongoose';

import type { IProject } from '../interfaces/IProject';

const projectSchema = new Schema<IProject>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		image: {
			type: Buffer,
		},
		testers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		developers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		archived: {
			type: Boolean,
			default: false,
		},
		teamId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Team',
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

export default model<IProject>('Project', projectSchema);
