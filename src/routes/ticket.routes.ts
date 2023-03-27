import express from 'express';

import ticketController from '../controllers/ticketController';
import auth from '../middleware/auth';

const router = express.Router();

router.use(auth);

router
	.route('/')
	.get(ticketController.getAllTickets)
	.post(ticketController.createNewTicket)
	.patch(ticketController.updateTicket)
	.delete(ticketController.deleteTicket);

export default router;
