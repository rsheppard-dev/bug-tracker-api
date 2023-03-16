import express from 'express';

import userController from '../controllers/userController';

const router = express.Router();

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createNewUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

export default router;
