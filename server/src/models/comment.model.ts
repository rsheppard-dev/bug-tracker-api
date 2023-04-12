import { modelOptions, prop, Ref } from '@typegoose/typegoose';

import { User } from './user.model';
import { Ticket } from './ticket.model';

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Comment {
	@prop({ required: true, trim: true })
	content: string;

	@prop({ ref: () => User })
	owner: Ref<User>;

	@prop({ ref: () => Ticket })
	ticket: Ref<Ticket>;
}
