import { Schema, model } from 'mongoose';

import type { ITeam } from '../interfaces/ITeam';

const teamSchema = new Schema<ITeam>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		logo: {
			type: Buffer,
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

export default model<ITeam>('Team', teamSchema);
