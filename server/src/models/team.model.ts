import {
	modelOptions,
	prop,
	Ref,
	type DocumentType,
	Severity,
} from '@typegoose/typegoose';

import { User } from './user.model';
import { Image } from './image.model';

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
	options: {
		allowMixed: Severity.ALLOW,
	},
})
export class Team {
	@prop({ required: true, trim: true })
	name: string;

	@prop({ trim: true })
	description: string;

	@prop()
	logo: Image;

	@prop({ required: true, ref: () => User })
	owner: Ref<User>;
}
