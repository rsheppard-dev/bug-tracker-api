import fs from 'fs';

import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { TeamModel } from '../models';
import { UserModel } from '../models';
import type {
	CreateTeamInput,
	DeleteTeamInput,
	UpdateTeamInput,
} from '../schemas/team.schema';
import { findUserById } from '../services/user.services';

// @desc get all teams
// @route GET /team
// @access private
const getAllTeamsHandler = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const teams = await TeamModel.find();

		if (!teams?.length) {
			return res.status(400).json({ message: 'No teams found.' });
		}

		const populatedTeams = await Promise.all(
			teams.map(async team => {
				await team.populate(['owner']);

				return {
					...team.toJSON(),
				};
			})
		);

		res.json(populatedTeams);
	}
);

// @desc create new team
// @route POST /team
// @access private
const createTeamHandler = asyncHandler(
	async (
		req: Request<{}, {}, CreateTeamInput>,
		res: Response
	): Promise<any> => {
		const { owner, name } = req.body;
		console.log(req.body);

		// if file uploaded include logo
		if (req.file) {
			req.body.logo = {
				data: fs.readFileSync('../../uploads/' + req.file.filename),
				contentType: req.file.mimetype,
			};
		}

		// check user id is valid
		const user = await UserModel.findById(owner).exec();

		if (!user) {
			return res.status(400).json({ message: 'Invalid user ID received.' });
		}

		// check team name doesn't already exist
		const duplicate = await TeamModel.findOne({ name }).lean().exec();

		if (duplicate) {
			return res
				.status(409)
				.json({ message: 'A team with that name is already registered.' });
		}

		// add team to database
		const team = await TeamModel.create({
			...req.body,
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
const updateTeamHandler = asyncHandler(
	async (
		req: Request<{}, {}, UpdateTeamInput>,
		res: Response
	): Promise<any> => {
		const { id, name, description, owner } = req.body;

		// find team in database
		const team = await TeamModel.findById(id).exec();

		if (!team) {
			return res.status(400).json({ message: 'No team found.' });
		}

		const user = owner && (await findUserById(owner));

		if (!user) return res.status(400).json({ message: 'No user found.' });

		// update team
		if (name) team.name = name;
		if (description) team.description = description;
		if (owner) team.owner = user._id;

		// if file uploaded include logo
		if (req.file) {
			team.logo = {
				data: fs.readFileSync('../../uploads/' + req.file.filename),
				contentType: req.file.mimetype,
			};
		}

		const updatedTeam = await team.save();

		res.json({ message: `${updatedTeam.name} updated.` });
	}
);

// @desc delete team
// @route DELETE /team
// @access private
const deleteTeamHandler = asyncHandler(
	async (
		req: Request<{}, {}, DeleteTeamInput>,
		res: Response
	): Promise<any> => {
		const { id } = req.body;

		// check data received
		if (!id) {
			return res.status(400).json({ message: 'Team ID required.' });
		}

		// check team exists
		const team = await TeamModel.findById(id).exec();

		if (!team) {
			return res.status(400).json({ message: 'Team not found.' });
		}

		const deletedTeam = await team.deleteOne();

		res.json({
			message: `${deletedTeam.name} deleted.`,
		});
	}
);

export default {
	getAllTeamsHandler,
	createTeamHandler,
	updateTeamHandler,
	deleteTeamHandler,
};
