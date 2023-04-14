import express from 'express';

import teamController from '../controllers/team.controller';
import authUser from '../middleware/authUser';
import upload from '../middleware/upload';

const router = express.Router();

// router.use(authUser);

router
	.route('/')
	.get(teamController.getAllTeams)
	.post(upload.single('logo'), teamController.createNewTeam)
	.patch(upload.single('logo'), teamController.updateTeam)
	.delete(teamController.deleteTeam);

router.post('/upload', upload.single('logo'), teamController.uploadHandler);

export default router;
