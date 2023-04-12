import type { Ticket } from './ticket';
import type { User } from './user';

export interface Comment {
	content: string;
	user: User;
	ticket: Ticket;
}
