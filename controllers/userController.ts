import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { hash } from 'bcrypt';

import User from '../models/User';
import Ticket from '../models/Ticket';
import IUser from '../interfaces/IUser';

// @desc get all users
// @route GET /user
// @access private
const getAllUsers = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const users = await User.find().select('-password').lean();

		if (!users?.length) {
			return res.status(400).json({ message: 'No users found' });
		}

		res.json(users);
	}
);

// @desc create new user
// @route POST /user
// @access private
const createNewUser = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		// get data from client
		const {
			username,
			password,
			roles,
		}: Pick<IUser, 'username' | 'password' | 'roles'> = req.body;

		// confirm user data
		if (!username || !password || !Array.isArray(roles) || !roles.length) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// check if user already exists
		const duplicate = await User.findOne({ username }).lean().exec();

		if (duplicate) {
			return res.status(409).json({ message: 'Duplicate username' });
		}

		// hash password
		const hashed = await hash(password, 12);

		// create and store new user
		const user = await User.create({
			username,
			password: hash,
			roles,
		});

		if (user) {
			res.status(201).json({ message: `New user ${username} created` });
		} else {
			res.status(400).json({ message: 'Invalid user data received' });
		}
	}
);

// @desc update user
// @route PATCH /user
// @access private
const updateUser = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { _id, username, roles, active, password }: IUser = req.body;

		// confirm user data is valid
		if (
			!_id ||
			!username ||
			!Array.isArray(roles) ||
			!roles.length ||
			typeof active !== 'boolean'
		) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// find user in database
		const user = await User.findById(_id).exec();

		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}

		// check or duplicate username
		const dupicate = await User.findOne({ username }).lean().exec();

		// only allow updates for original username owner
		if (dupicate && dupicate?._id.toString() !== _id) {
			return res.status(409).json({ message: 'Duplicate username' });
		}

		// update user
		user.username = username;
		user.roles = roles;
		user.active = active;

		if (password) {
			// hash password before updating
			user.password = await hash(password, 12);
		}

		// save updated user
		const updatedUser = await user.save();

		res.json({ message: `${updatedUser.username} updated` });
	}
);

// @desc delete user
// @route DELETE /user
// @access private
const deleteUser = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { _id } = req.body;

		if (!_id) {
			return res.status(400).json({ message: 'User ID required' });
		}

		// get user from database
		const user = await User.findById(_id).exec();

		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}

		// check if user has any open tickets assigned
		const tickets = await Ticket.findOne({ userId: _id }).lean().exec();

		if (tickets) {
			return res.status(400).json({ message: 'User has assigned tickets' });
		}

		// delete user
		const deletedUser = await user.deleteOne();

		res.json({
			message: `Username ${deletedUser.username} with ID ${deletedUser._id} deleted`,
		});
	}
);

export default { getAllUsers, createNewUser, updateUser, deleteUser };
