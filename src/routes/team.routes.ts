import express from 'express';

import teamController from '../controllers/teamController';
import auth from '../middleware/auth';

const router = express.Router();

router.use(auth);

router
	.route('/')
	.get(teamController.getAllTeams)
	.post(teamController.createNewTeam)
	.patch(teamController.updateTeam)
	.delete(teamController.deleteTeam);

export default router;
