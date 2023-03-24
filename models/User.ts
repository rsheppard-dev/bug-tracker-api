import { Schema, model } from 'mongoose';

import { IUser, Role } from '../interfaces/IUser';

const userSchema = new Schema<IUser>(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		roles: [
			{
				teamId: {
					type: Schema.Types.ObjectId,
					ref: 'Team',
				},
				roles: [
					{
						type: String,
						enum: Role,
					},
				],
			},
		],
	},
	{
		timestamps: true,
	}
);

export default model<IUser>('User', userSchema);
