import express from 'express';

import teamController from '../controllers/team.controller';
import authUser from '../middleware/authUser';
import upload from '../middleware/upload';
import validateResource from '../middleware/validateResource';
import {
	createTeamSchema,
	deleteTeamSchema,
	updateTeamSchema,
} from '../schemas/team.schema';

const router = express.Router();

// router.use(authUser);

router
	.route('/')
	.get(teamController.getAllTeamsHandler)
	.post(
		upload.single('logo'),
		validateResource(createTeamSchema),
		teamController.createTeamHandler
	)
	.patch(
		upload.single('logo'),
		validateResource(updateTeamSchema),
		teamController.updateTeamHandler
	)
	.delete(validateResource(deleteTeamSchema), teamController.deleteTeamHandler);

export default router;
