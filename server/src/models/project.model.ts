import {
	modelOptions,
	prop,
	Ref,
	type DocumentType,
} from '@typegoose/typegoose';

import { Team } from './team.model';
import { User } from './user.model';

@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: {
			transform: (doc: DocumentType<Project>, ret) => {
				delete ret.__v;
				ret.id = ret._id;
				delete ret._id;
			},
		},
	},
})
export class Project {
	@prop({ required: true, trim: true })
	name: string;

	@prop({ trim: true })
	description: string;

	@prop()
	image: Buffer;

	@prop({ ref: () => Team })
	team: Ref<Team>;

	@prop({ ref: () => User })
	manager: Ref<User>;

	@prop({ ref: () => User })
	testers: Ref<User>[];

	@prop({ ref: () => User })
	developers: Ref<User>[];

	@prop({ default: false })
	archived: boolean;

	@prop({ required: true, ref: () => User })
	owner: Ref<User>;
}
