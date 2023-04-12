import express from 'express';

import userController from '../controllers/user.controller';
import authUser from '../middleware/authUser';
import validateResource from '../middleware/validateResource';
import {
	createUserSchema,
	forgottenPasswordSchema,
	resetPasswordSchema,
	updateUserSchema,
	verifyUserSchema,
} from '../schemas/user.schema';

const router = express.Router();

router
	.route('/')
	.get(userController.getAllUsers)
	.post(validateResource(createUserSchema), userController.createUserHandler)
	.patch(validateResource(updateUserSchema), userController.updateUserHandler)
	.delete(userController.deleteUserHandler);

router.get(
	'/verify/:id/:verificationCode',
	validateResource(verifyUserSchema),
	userController.verifyUserHandler
);

router.post(
	'/forgottenpassword',
	validateResource(forgottenPasswordSchema),
	userController.forgottenPasswordHandler
);

router.post(
	'/resetpassword/:id/:passwordResetCode',
	validateResource(resetPasswordSchema),
	userController.resetPasswordHandler
);

router.route('/me').get(authUser, userController.getCurrentUserHandler);

export default router;
