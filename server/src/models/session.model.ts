import { modelOptions, prop, Ref } from '@typegoose/typegoose';

import { User } from './user.model';

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Session {
	@prop({ ref: () => User, required: true })
	userId: Ref<User>;

	@prop({ default: true })
	valid: boolean;

	@prop()
	userAgent: string;
}
