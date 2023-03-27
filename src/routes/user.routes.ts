import express from 'express';

import userController from '../controllers/user.controller';
import auth from '../middleware/auth';
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schemas/user.schema';

const router = express.Router();

router
	.route('/')
	.get(auth, userController.getAllUsers)
	.post(validateResource(createUserSchema), userController.createUserHandler)
	.patch(auth, userController.updateUser)
	.delete(auth, userController.deleteUser);

export default router;
