import { TicketModel } from '../models';
import type { Ticket } from '../models/ticket.model';

export function createTicket(ticket: Partial<Ticket>) {
	return TicketModel.create(ticket);
}

export async function findTicketById(id: string) {
	return TicketModel.findById(id);
}
