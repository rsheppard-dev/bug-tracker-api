import { sign } from 'jsonwebtoken';
import {
	modelOptions,
	prop,
	Severity,
	pre,
	DocumentType,
	Ref,
} from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';
import { hash, verify } from 'argon2';

import { Team } from './team.model';

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
// @middleware
@pre<User>('save', async function (next) {
	const user = this;

	// ensure password is hashed before saving
	if (user.isModified('password')) {
		user.password = await hash(user.password);
	}

	next();
})
export class User {
	@prop({ lowercase: true, required: true, unique: true, trim: true })
	email: string;

	@prop({ required: true, trim: true })
	firstName: string;

	@prop({ required: true, trim: true })
	lastName: string;

	@prop({ default: () => uuid() })
	password: string;

	@prop()
	passwordResetCode: string | null;

	@prop({ required: true, trim: true })
	verificationCode: string;

	@prop({ default: false })
	verified: boolean;

	@prop()
	roles: Roles[];

	// methods
	getFullName(this: DocumentType<User>) {
		const { firstName, lastName } = this;
		return `${firstName} ${lastName}`;
	}

	async validatePassword(this: DocumentType<User>, password: string) {
		try {
			return await verify(this.password, password);
		} catch (error) {
			console.log(error, 'Could not validate password.');
			return false;
		}
	}

	generateAccessToken = function (this: DocumentType<User>) {
		const user = this;

		const payload = {
			id: user._id.toString(),
			email: user.email,
			roles: user.roles,
		};
		const secret = process.env.ACCESS_TOKEN_SECRET!;

		const token = sign(payload, secret, { expiresIn: '1m' });
		return token;
	};

	generateRefreshToken = function (this: DocumentType<User>) {
		const user = this;

		const payload = { id: user._id.toString() };
		const secret = process.env.REFRESH_TOKEN_SECRET!;

		const token = sign(payload, secret, { expiresIn: '1d' });
		return token;
	};
}

enum Role {
	TESTER = 'TESTER',
	DEVELOPER = 'DEVELOPER',
	MANAGER = 'MANAGER',
	ADMIN = 'ADMIN',
}

class Roles {
	@prop({ ref: () => Team })
	teamId: Ref<Team>;

	@prop({ enum: Role })
	role: Role[];
}
