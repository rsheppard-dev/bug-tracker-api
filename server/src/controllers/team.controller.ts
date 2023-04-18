import fs from 'fs';

import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { TeamModel, UserModel } from '../models';
import type {
	CreateTeamInput,
	DeleteTeamInput,
	UpdateTeamInput,
} from '../schemas/team.schema';

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

		// if file uploaded include logo
		if (req.file) {
			req.body.logo = {
				data: fs.readFileSync('../../uploads/' + req.file.filename),
				contentType: req.file.mimetype,
			};
		}

		// check user id is valid
		const user = await UserModel.findById(owner).orFail(
			new Error('Invalid user id.')
		);

		// check team name doesn't already exist
		const duplicate = await name;

		if (duplicate) {
			return res
				.status(409)
				.json({ message: 'A team with that name is already registered.' });
		}

		try {
			// add team to database
			const team = await TeamModel.create(req.body);

			res.status(201).json({ message: `${team.name} created.` });
		} catch (error: any) {
			// typegoose error checks
			if (error.code === 11000) {
				console.log(error);
				return res
					.status(409)
					.json({ message: 'A team with that name already exists.' });
			}
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
		const team = await TeamModel.findById(id);

		if (!team) {
			return res.status(400).json({ message: 'No team found.' });
		}

		if (name) {
			// check team name doesn't already exist
			const duplicate = await TeamModel.findOne({ name });

			if (duplicate && duplicate.name !== team.name) {
				return res
					.status(409)
					.json({ message: 'A team with that name is already registered.' });
			}
		}

		const user = await UserModel.findById(owner).orFail(
			new Error('No user found.')
		);

		// update team
		if (name) team.name = name;
		if (description) team.description = description;
		if (owner) team.owner = user.id;

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
		const team = await TeamModel.findById(id).orFail(
			new Error('No team found.')
		);

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
