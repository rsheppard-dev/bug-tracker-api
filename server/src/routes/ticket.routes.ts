import express from 'express';

import ticketController from '../controllers/ticket.controller';
import authUser from '../middleware/authUser';

const router = express.Router();

// router.use(authUser);

router
	.route('/')
	.get(ticketController.getAllTickets)
	.post(ticketController.createNewTicket)
	.patch(ticketController.updateTicket)
	.delete(ticketController.deleteTicket);

export default router;
