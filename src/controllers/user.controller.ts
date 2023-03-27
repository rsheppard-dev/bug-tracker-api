import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { UserModel } from '../models';
import { TicketModel } from '../models';
import type { CreateUserInput } from '../schemas/user.schema';
import { createUser } from '../services/user.services';

// @desc get all users
// @route GET /user
// @access private
const getAllUsers = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const users = await UserModel.find().lean();

		if (!users?.length) {
			return res.status(400).json({ message: 'No users found.' });
		}

		res.json(users);
	}
);

// @desc create new user
// @route POST /user
// @access private
const createUserHandler = async (
	req: Request<{}, {}, CreateUserInput>,
	res: Response
): Promise<any> => {
	try {
		const user = await createUser(req.body);

		return res.json({ message: 'New user successfully created.' });
	} catch (error: any) {
		if (error.code === 11000) {
			return res
				.status(409)
				.json({ message: 'Account already exists with that email address.' });
		}

		return res
			.status(500)
			.json({ error: error.errors, message: 'Failed to create new user.' });
	}
};

// @desc update user
// @route PATCH /user
// @access private
const updateUser = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const { id, email } = req.body;

		const updates = Object.keys(req.body);
		const allowedUpdates = [
			'firstName',
			'lastName',
			'email',
			'password',
			'roles',
		];
		const isValidOperation = updates.every(update =>
			allowedUpdates.includes(update)
		);

		if (!isValidOperation) {
			return res.status(400).json({ error: 'Invalid updates.' });
		}

		// find user in database
		const user = await UserModel.findById(id).exec();

		if (!user) {
			return res.status(400).json({ message: 'User not found.' });
		}

		// check for duplicate email
		const dupicate = await UserModel.findOne({ email }).lean().exec();

		// only allow updates for original email owner
		if (dupicate && dupicate?._id.toString() !== id) {
			return res.status(409).json({
				message: 'An account is already registered with that email address.',
			});
		}

		// update user
		// updates.forEach(update => (user[update as keyof User] = req.body[update]));

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
		const user = await UserModel.findById(id).exec();

		if (!user) {
			return res.status(400).json({ message: 'User not found.' });
		}

		// check if user has any open tickets assigned
		const tickets = await TicketModel.findOne({ userId: id }).lean().exec();

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

export default { getAllUsers, createUserHandler, updateUser, deleteUser };
