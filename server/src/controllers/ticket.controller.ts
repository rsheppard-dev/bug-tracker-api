import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { ProjectModel, UserModel } from '../models';
import { TicketModel } from '../models';

// @desc get all tickets
// @route GET /ticket
// @access private
const getAllTickets = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const tickets = await TicketModel.find();

		if (!tickets?.length) {
			return res.status(404).json({ message: 'No tickets found.' });
		}

		const populatedTickets = await Promise.all(
			tickets.map(async ticket => {
				await ticket.populate(['owner', 'project']);

				return {
					...ticket.toJSON(),
				};
			})
		);

		res.json(populatedTickets);
	}
);

// @desc create new ticket
// @route POST /ticket
// @access private
const createNewTicket = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		// check user id is valid
		const user = await UserModel.findById(req.body.owner).orFail(
			new Error('Invalid user ID.')
		);

		const project = await ProjectModel.findById(req.body.project).orFail(
			new Error('Invalid project ID.')
		);

		// add ticket to database
		const ticket = await TicketModel.create(req.body);

		if (ticket) {
			res
				.status(201)
				.json({ message: `New ticket with ID: ${ticket.id} created.` });
		} else {
			res.status(400).json({ message: 'Invalid ticket data received.' });
		}
	}
);

// @desc update ticket
// @route PATCH /ticket
// @access private
const updateTicket = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const {
			id,
			title,
			description,
			category,
			priority,
			developerId,
			completed,
		} = req.body;

		// find ticket in database
		const ticket = await TicketModel.findById(id).exec();

		if (!ticket) {
			return res.status(400).json({ message: 'No ticket found' });
		}

		// update ticket
		ticket.title = title;
		ticket.description = description;
		ticket.completed = completed;
		ticket.category = category;
		ticket.priority = priority;

		if (developerId) {
			const developer = await UserModel.findById(developerId).exec();

			if (!developer) {
				return res.status(400).json({
					message: 'Unable to assign to invalid user as a developer.',
				});
			}

			ticket.developer = developerId;
		}

		const updatedTicket = await ticket.save();

		res.json({ message: `Ticket ID: ${updatedTicket._id} updated.` });
	}
);

// @desc delete ticket
// @route DELETE /ticket
// @access private
const deleteTicket = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id } = req.body;

		// check data received
		if (!id) {
			return res.status(400).json({ message: 'Ticket ID required.' });
		}

		// check ticket exists
		const ticket = await TicketModel.findById(id).exec();

		if (!ticket) {
			return res.status(400).json({ message: 'Ticket not found.' });
		}

		const deletedTicket = await ticket.deleteOne();

		res.json({
			message: `Ticket ID: ${deletedTicket.id} deleted.`,
		});
	}
);

export default { getAllTickets, createNewTicket, updateTicket, deleteTicket };
