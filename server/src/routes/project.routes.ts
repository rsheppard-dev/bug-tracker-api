import express from 'express';

import projectController from '../controllers/project.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.use(auth);

router
	.route('/')
	.get(projectController.getAllProjects)
	.post(projectController.createNewProject)
	.patch(projectController.updateProject)
	.delete(projectController.deleteProject);

export default router;
