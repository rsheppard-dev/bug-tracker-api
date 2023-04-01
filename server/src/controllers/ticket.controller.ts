import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { UserModel } from '../models';
import { TicketModel } from '../models';

// @desc get all tickets
// @route GET /ticket
// @access private
const getAllTickets = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const tickets = await TicketModel.find().lean();

		if (!tickets?.length) {
			return res.status(400).json({ message: 'No tickets found.' });
		}

		res.json(tickets);
	}
);

// @desc create new ticket
// @route POST /ticket
// @access private
const createNewTicket = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { userId, projectId, title, description, category, priority } =
			req.body;

		// confirm valid data received
		if (
			!userId ||
			!projectId ||
			!title ||
			!description ||
			!category ||
			!priority
		) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// check user id is valid
		const user = await UserModel.findById(userId).exec();

		if (!user) {
			return res.status(400).json({ message: 'Invalid user ID received.' });
		}

		// add ticket to database
		const ticket = await TicketModel.create({
			userId,
			projectId,
			title,
			description,
			category,
			priority,
		});

		if (ticket) {
			res
				.status(201)
				.json({ message: `New ticket with ID: ${ticket._id} created.` });
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
			projectId,
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
			message: `Ticket ID: ${deletedTicket._id} deleted.`,
		});
	}
);

export default { getAllTickets, createNewTicket, updateTicket, deleteTicket };
