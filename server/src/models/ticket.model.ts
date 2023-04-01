import { modelOptions, prop, Ref } from '@typegoose/typegoose';

import { User } from './user.model';
import { Project } from './project.model';

enum Category {
	DESIGN = 'DESIGN',
	BUG = 'BUG',
	FEATURE = 'FEATURE',
	SECURITY = 'SECURITY',
}

enum Priority {
	LOW = 'LOW',
	MODERATE = 'MODERATE',
	HIGH = 'HIGH',
}

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Ticket {
	@prop({ required: true, trim: true })
	title: string;

	@prop({ required: true, trim: true })
	description: string;

	@prop({ required: true, enum: Category })
	category: Category;

	@prop({ required: true, enum: Priority })
	priority: Priority;

	@prop({ default: false })
	completed: false;

	@prop({ required: true, ref: () => User })
	owner: Ref<User>;

	@prop({ required: true, ref: () => Project })
	project: Ref<Project>;

	@prop({ ref: () => User })
	developer: Ref<User>;
}
