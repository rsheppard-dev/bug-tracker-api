import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import User from '../models/User';
import Ticket from '../models/Ticket';
import ITicket from '../interfaces/ITicket';

// @desc get all tickets
// @route GET /ticket
// @access private
const getAllTickets = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const tickets = await Ticket.find().lean();

		if (!tickets?.length) {
			return res.status(400).json({ message: 'No tickets found' });
		}

		res.json(tickets);
	}
);

// @desc create new ticket
// @route POST /ticket
// @access private
const createNewTicket = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { userId, title, description }: ITicket = req.body;

		// confirm valid data received
		if (!userId || !title || !description) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// check user id is valid
		const user = await User.findById(userId).exec();

		if (!user) {
			return res.status(400).json({ message: 'Invalid user ID received' });
		}

		// add ticket to database
		const ticket = await Ticket.create({
			userId,
			title,
			description,
		});

		if (ticket) {
			res.status(201).json({ message: `New ticket ${ticket._id} created` });
		} else {
			res.status(400).json({ message: 'Invalid ticket data received' });
		}
	}
);

// @desc update ticket
// @route PATCH /ticket
// @access private
const updateTicket = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id, userId, title, description, completed }: ITicket = req.body;

		// confirm all data received and valid
		if (!id || !title || !description || typeof completed !== 'boolean') {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// find ticket in database
		const ticket = await Ticket.findById(id).exec();

		if (!ticket) {
			return res.status(400).json({ message: 'No ticket found' });
		}

		// update ticket
		ticket.title = title;
		ticket.description = description;
		ticket.completed = completed;

		if (userId) {
			const user = await User.findById(userId).exec();

			if (!user) {
				return res
					.status(400)
					.json({ message: 'Unable to assign to invalid user' });
			}

			ticket.userId = userId;
		}

		const updatedTicket = await ticket.save();

		res.json({ message: `Ticket ${updatedTicket._id} updated` });
	}
);

// @desc delete ticket
// @route DELETE /ticket
// @access private
const deleteTicket = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { _id } = req.body;

		// check data received
		if (!_id) {
			return res.status(400).json({ message: 'Ticket ID required' });
		}

		// check ticket exists
		const ticket = await Ticket.findById(_id).exec();

		if (!ticket) {
			return res.status(400).json({ message: 'Ticket not found' });
		}

		const deletedTicket = await ticket.deleteOne();

		res.json({
			message: `Ticket ${deletedTicket._id} deleted`,
		});
	}
);

export default { getAllTickets, createNewTicket, updateTicket, deleteTicket };
