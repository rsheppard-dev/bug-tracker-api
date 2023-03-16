import { Schema, model } from 'mongoose';

import IUser from '../interfaces/IUser';

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	roles: [
		{
			type: String,
			default: 'Basic',
		},
	],
	active: {
		type: Boolean,
		default: true,
	},
});

export default model<IUser>('User', userSchema);
