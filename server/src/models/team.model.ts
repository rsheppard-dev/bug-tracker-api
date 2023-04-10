import {
	modelOptions,
	prop,
	Ref,
	type DocumentType,
} from '@typegoose/typegoose';

import { User } from './user.model';

@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: {
			transform: (doc: DocumentType<Team>, ret) => {
				delete ret.__v;
				ret.id = ret._id;
				delete ret._id;
			},
		},
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
