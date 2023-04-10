import {
	modelOptions,
	prop,
	Severity,
	pre,
	DocumentType,
	Ref,
	index,
} from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import { hash, verify } from 'argon2';

import { Team } from './team.model';
@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: {
			transform: (doc: DocumentType<User>, ret) => {
				delete ret.__v;
				delete ret.password;
				delete ret.passwordResetCode;
				delete ret.verificationCode;
				ret.id = ret._id;
				delete ret._id;
			},
		},
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
// @middleware
@pre<User>('save', async function (next) {
	const user = this;

	// ensure password is hashed before saving
	if (user.isModified('password')) user.password = await hash(user.password);

	next();
})
@index({ email: 1 })
export class User {
	@prop({ lowercase: true, required: true, unique: true, trim: true })
	email: string;

	@prop({ required: true, trim: true })
	firstName: string;

	@prop({ required: true, trim: true })
	lastName: string;

	@prop({ required: true, trim: true })
	password: string;

	@prop()
	passwordResetCode: string | null;

	@prop({ default: () => nanoid(6) })
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
}

export enum Role {
	TESTER = 'TESTER',
	DEVELOPER = 'DEVELOPER',
	MANAGER = 'MANAGER',
	ADMIN = 'ADMIN',
}

export class Roles {
	@prop({ ref: () => Team })
	teamId: Ref<Team>;

	@prop({ enum: Role })
	role: Role;
}
