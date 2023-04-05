import express from 'express';

import sessionController from '../controllers/session.controller';
import loginLimiter from '../middleware/loginLimiter';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schemas/session.schema';
import authUser from '../middleware/authUser';

const router = express.Router();

router
	.route('/')
	.post(
		loginLimiter,
		validateResource(createSessionSchema),
		sessionController.createSessionHandler
	)
	.get(authUser, sessionController.getUserSessionsHandler)
	.delete(authUser, sessionController.deleteSessionHandler);

router.route('/refresh').post(sessionController.refreshTokenHandler);

export default router;
