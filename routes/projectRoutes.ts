import express from 'express';

import projectController from '../controllers/projectController';

const router = express.Router();

router
	.route('/')
	.get(projectController.getAllProjects)
	.post(projectController.createNewProject)
	.patch(projectController.updateProject)
	.delete(projectController.deleteProject);

export default router;
