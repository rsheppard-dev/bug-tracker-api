import express from 'express';

import teamController from '../controllers/teamController';

const router = express.Router();

router
	.route('/')
	.get(teamController.getAllTeams)
	.post(teamController.createNewTeam)
	.patch(teamController.updateTeam)
	.delete(teamController.deleteTeam);

export default router;
