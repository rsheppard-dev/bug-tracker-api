import express from 'express';

import teamController from '../controllers/team.controller';
import authUser from '../middleware/authUser';

const router = express.Router();

// router.use(authUser);

router
	.route('/')
	.get(teamController.getAllTeams)
	.post(teamController.createNewTeam)
	.patch(teamController.updateTeam)
	.delete(teamController.deleteTeam);

export default router;
