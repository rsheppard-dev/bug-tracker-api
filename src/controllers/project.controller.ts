import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { ProjectModel, TeamModel } from '../models';
import { UserModel } from '../models';

// @desc get all projects
// @route GET /project
// @access private
const getAllProjects = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const projects = await ProjectModel.find().lean();

		if (!projects?.length) {
			return res.status(400).json({ message: 'No projects found.' });
		}

		res.json(projects);
	}
);

// @desc create new project
// @route POST /project
// @access private
const createNewProject = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { userId, name, teamId } = req.body;

		// confirm valid data received
		if (!userId || !name || !teamId) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// check user id is valid
		const user = await UserModel.findById(userId).exec();

		if (!user) {
			return res.status(400).json({ message: 'Invalid user ID received.' });
		}

		// check team id is valid
		const team = await TeamModel.findById(teamId).exec();

		if (!team) {
			return res.status(400).json({ message: 'Invalid team ID received.' });
		}

		// check project name doesn't already exist on team
		const duplicate = await ProjectModel.findOne({ name }).lean().exec();

		if (duplicate && duplicate.team.toString() === teamId) {
			return res
				.status(400)
				.json({ message: 'A project with that name already exists.' });
		}

		// add project to database
		const project = await ProjectModel.create({
			...req.body,
		});

		if (project) {
			res.status(201).json({ message: `${project.name} created.` });
		} else {
			res.status(400).json({ message: 'Invalid team data received.' });
		}
	}
);

// @desc update project
// @route PATCH /project
// @access private
const updateProject = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id, name, description, image, testers, developers, archived } =
			req.body;

		// confirm all data received and valid
		if (!id || !name) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// find project in database
		const project = await ProjectModel.findById(id).exec();

		if (!project) {
			return res.status(400).json({ message: 'No project found.' });
		}

		// update project
		project.name = name;
		if (description) project.description = description;

		if (image) {
			project.image = image;
		}

		if (testers) project.testers;
		if (developers) project.developers;
		if (archived) project.archived;

		const updatedProject = await project.save();

		res.json({ message: `${updatedProject.name} updated.` });
	}
);

// @desc delete project
// @route DELETE /project
// @access private
const deleteProject = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id } = req.body;

		// check data received
		if (!id) {
			return res.status(400).json({ message: 'Project ID required.' });
		}

		// check team exists
		const project = await ProjectModel.findById(id).exec();

		if (!project) {
			return res.status(400).json({ message: 'Project not found.' });
		}

		const deletedProject = await project.deleteOne();

		res.json({
			message: `${deletedProject.name} deleted.`,
		});
	}
);

export default {
	getAllProjects,
	createNewProject,
	updateProject,
	deleteProject,
};
