import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import Project from '../models/Project';
import User from '../models/User';
import type { IProject } from '../interfaces/IProject';
import Team from '../models/Team';

// @desc get all projects
// @route GET /project
// @access private
const getAllProjects = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const projects = await Project.find().lean();

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
		const { userId, name, description, teamId }: IProject = req.body;

		// confirm valid data received
		if (!userId || !name || !teamId) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// check user id is valid
		const user = await User.findById(userId).exec();

		if (!user) {
			return res.status(400).json({ message: 'Invalid user ID received.' });
		}

		// check team id is valid
		const team = await Team.findById(teamId).exec();

		if (!team) {
			return res.status(400).json({ message: 'Invalid team ID received.' });
		}

		// check project name doesn't already exist on team
		const duplicate = await Project.findOne({ name }).lean().exec();

		if (duplicate && duplicate.teamId.toString() === teamId) {
			return res
				.status(400)
				.json({ message: 'A project with that name already exists.' });
		}

		// add project to database
		const project = await Project.create({
			userId,
			name,
			description,
			teamId,
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
		const {
			id,
			name,
			description,
			image,
			testers,
			developers,
			archived,
		}: IProject = req.body;

		// confirm all data received and valid
		if (!id || !name) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// find project in database
		const project = await Project.findById(id).exec();

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
		const project = await Project.findById(id).exec();

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
