import express from 'express';

import projectController from '../controllers/project.controller';
import authUser from '../middleware/authUser';

const router = express.Router();

router.use(authUser);

router
	.route('/')
	.get(projectController.getAllProjects)
	.post(projectController.createNewProject)
	.patch(projectController.updateProject)
	.delete(projectController.deleteProject);

export default router;
