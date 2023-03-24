import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import Team from '../models/Team';
import User from '../models/User';
import type { ITeam } from '../interfaces/ITeam';

// @desc get all teams
// @route GET /team
// @access private
const getAllTeams = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const teams = await Team.find().lean();

		if (!teams?.length) {
			return res.status(400).json({ message: 'No teams found.' });
		}

		res.json(teams);
	}
);

// @desc create new team
// @route POST /team
// @access private
const createNewTeam = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { userId, name, description }: ITeam = req.body;

		// confirm valid data received
		if (!userId || !name) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// check user id is valid
		const user = await User.findById(userId).exec();

		if (!user) {
			return res.status(400).json({ message: 'Invalid user ID received.' });
		}

		// check team name doesn't already exist
		const duplicate = await Team.findOne({ name }).lean().exec();

		if (duplicate) {
			return res
				.status(400)
				.json({ message: 'A team with that name is already registered.' });
		}

		// add team to database
		const team = await Team.create({
			userId,
			name,
			description,
		});

		if (team) {
			res.status(201).json({ message: `${team.name} created.` });
		} else {
			res.status(400).json({ message: 'Invalid team data received.' });
		}
	}
);

// @desc update team
// @route PATCH /team
// @access private
const updateTeam = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id, name, description, logo, userId }: ITeam = req.body;

		// confirm all data received and valid
		if (!id || !name || !description) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// find team in database
		const team = await Team.findById(id).exec();

		if (!team) {
			return res.status(400).json({ message: 'No team found.' });
		}

		// update ticket
		team.name = name;
		team.description = description;

		if (logo) {
			team.logo = logo;
		}

		if (userId) {
			const user = await User.findById(userId).exec();

			if (!user) {
				return res.status(400).json({
					message: 'Unable to transfer team to invalid user.',
				});
			}

			team.userId = userId;
		}

		const updatedTeam = await team.save();

		res.json({ message: `${updatedTeam.name} updated.` });
	}
);

// @desc delete team
// @route DELETE /team
// @access private
const deleteTeam = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id } = req.body;

		// check data received
		if (!id) {
			return res.status(400).json({ message: 'Team ID required.' });
		}

		// check team exists
		const team = await Team.findById(id).exec();

		if (!team) {
			return res.status(400).json({ message: 'Team not found.' });
		}

		const deletedTeam = await team.deleteOne();

		res.json({
			message: `${deletedTeam.name} deleted.`,
		});
	}
);

export default { getAllTeams, createNewTeam, updateTeam, deleteTeam };
