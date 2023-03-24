import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { hash } from 'bcrypt';

import User from '../models/User';
import Ticket from '../models/Ticket';
import type { IUser } from '../interfaces/IUser';

// @desc get all users
// @route GET /user
// @access private
const getAllUsers = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const users = await User.find().select('-password').lean();

		if (!users?.length) {
			return res.status(400).json({ message: 'No users found.' });
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
			firstName,
			lastName,
			email,
			password,
			roles,
		}: Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password' | 'roles'> =
			req.body;

		// confirm user data
		if (!firstName || !lastName || !email || !password) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// check if user already exists
		const duplicate = await User.findOne({ email }).lean().exec();

		if (duplicate) {
			return res
				.status(409)
				.json({ message: 'An account with that email is already registered.' });
		}

		// hash password
		const hashed = await hash(password, 12);

		// create and store new user
		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hash,
			roles,
		});

		if (user) {
			res.status(201).json({ message: `New account for ${email} created.` });
		} else {
			res.status(400).json({ message: 'Invalid user data received.' });
		}
	}
);

// @desc update user
// @route PATCH /user
// @access private
const updateUser = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id, firstName, lastName, email, roles, password }: IUser = req.body;

		// confirm user data is valid
		if (
			!id ||
			!firstName ||
			!lastName ||
			!email ||
			!Array.isArray(roles) ||
			!roles.length
		) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// find user in database
		const user = await User.findById(id).exec();

		if (!user) {
			return res.status(400).json({ message: 'User not found.' });
		}

		// check for duplicate email
		const dupicate = await User.findOne({ email }).lean().exec();

		// only allow updates for original email owner
		if (dupicate && dupicate?._id.toString() !== id) {
			return res.status(409).json({
				message: 'An account is already registered with that email address.',
			});
		}

		// update user
		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		user.roles = roles;

		if (password) {
			// hash password before updating
			user.password = await hash(password, 12);
		}

		// save updated user
		const updatedUser = await user.save();

		res.json({ message: `Account for ${updatedUser.email} updated.` });
	}
);

// @desc delete user
// @route DELETE /user
// @access private
const deleteUser = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id } = req.body;

		if (!id) {
			return res.status(400).json({ message: 'User ID required.' });
		}

		// get user from database
		const user = await User.findById(id).exec();

		if (!user) {
			return res.status(400).json({ message: 'User not found.' });
		}

		// check if user has any open tickets assigned
		const tickets = await Ticket.findOne({ userId: id }).lean().exec();

		if (tickets) {
			return res.status(400).json({ message: 'User has assigned tickets.' });
		}

		// delete user
		const deletedUser = await user.deleteOne();

		res.json({
			message: `Account for ${deletedUser.email} with ID ${deletedUser._id} deleted.`,
		});
	}
);

export default { getAllUsers, createNewUser, updateUser, deleteUser };
