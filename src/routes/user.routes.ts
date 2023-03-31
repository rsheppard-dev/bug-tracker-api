import express from 'express';

import userController from '../controllers/user.controller';
import auth from '../middleware/auth';
import validateResource from '../middleware/validateResource';
import {
	createUserSchema,
	forgottenPasswordSchema,
	resetPasswordSchema,
	verifyUserSchema,
} from '../schemas/user.schema';

const router = express.Router();

router
	.route('/')
	.get(auth, userController.getAllUsers)
	.post(validateResource(createUserSchema), userController.createUserHandler)
	.patch(auth, userController.updateUser)
	.delete(auth, userController.deleteUser);

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

router.route('/me').get(auth, userController.getCurrentUserHandler);

export default router;
