import express from 'express';

import authController from '../controllers/auth.controller';
import loginLimiter from '../middleware/loginLimiter';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schemas/auth.schema';

const router = express.Router();

router
	.route('/')
	.post(
		loginLimiter,
		validateResource(createSessionSchema),
		authController.createSessionHandler
	);

router.route('/refresh').get(authController.refreshAccessTokenHandler);

router.route('/logout').post(authController.deleteSessionHandler);

export default router;
