import { compare, hash } from 'bcrypt';
import { Schema, model, type Model, type HydratedDocument } from 'mongoose';
import { sign } from 'jsonwebtoken';

import { type IUser, Role } from '../interfaces/IUser';

interface IUserMethods {
	getFullName(): string;
	generateAccessToken(): string;
	generateRefreshToken(): string;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
	findByCredentials(
		email: string,
		password: string
	): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
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

// @statics
// find users by credentials
userSchema.statics.findByCredentials = async function (email, password) {
	const user = await this.findOne({ email });

	if (!user) throw new Error('Failed to login.');

	const isMatch = await compare(password, user.password);

	if (!isMatch) throw new Error('Failed to login.');

	return user;
};

// @methods
// get the full name of a user
userSchema.methods.getFullName = function () {
	const { firstName, lastName } = this;
	return `${firstName} ${lastName}`;
};

// get public profile
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	// remove password
	delete userObject.password;

	return userObject;
};

// generate a JWT access token
userSchema.methods.generateAccessToken = function () {
	const user = this;
	const token = sign(
		{ id: user._id.toString(), roles: user.roles },
		process.env.ACCESS_TOKEN_SECRET!,
		{ expiresIn: '1m' }
	);
	return token;
};

// generate a JWT refresh token
userSchema.methods.generateRefreshToken = function () {
	const user = this;
	const token = sign(
		{ id: user._id.toString() },
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: '7d' }
	);
	return token;
};

// @middleware
// run checks before saving
userSchema.pre('save', async function (next) {
	const user = this;

	// ensure password is hashed before saving
	if (user.isModified('password')) {
		user.password = await hash(user.password, 12);
	}

	next();
});

export default model<IUser, UserModel>('User', userSchema);
