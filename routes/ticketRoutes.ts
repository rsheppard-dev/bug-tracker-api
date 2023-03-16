import express from 'express';

import ticketController from '../controllers/ticketController';

const router = express.Router();

router
	.route('/')
	.get(ticketController.getAllTickets)
	.post(ticketController.createNewTicket)
	.patch(ticketController.updateTicket)
	.delete(ticketController.deleteTicket);

export default router;
