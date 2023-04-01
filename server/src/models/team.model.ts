import { modelOptions, prop, Ref } from '@typegoose/typegoose';

import { User } from './user.model';

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Team {
	@prop({ required: true, trim: true })
	name: string;

	@prop({ trim: true })
	description: string;

	@prop()
	logo: Buffer;

	@prop({ required: true, ref: () => User })
	owner: Ref<User>;
}
