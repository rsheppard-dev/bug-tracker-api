import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';
import { get, updateWith } from 'lodash';

import { UserModel } from '../models';
import { TicketModel } from '../models';
import type {
	CreateUserInput,
	ForgottenPasswordInput,
	ResetPasswordInput,
	UpdateUserInput,
	VerifyUserInput,
} from '../schemas/user.schema';
import {
	createUser,
	findUserByEmail,
	findUserById,
} from '../services/user.services';
import sendMail from '../utils/mail';
import { sendVerificationEmail } from '../services/email.services';

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
// @access public
const createUserHandler = asyncHandler(
	async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
		const user = await createUser(req.body);

		sendVerificationEmail(user);

		res.json(user);
	}
);

// @desc verify new user
// @route GET /user/verify/:id/:verificationCode
// @access public
const verifyUserHandler = asyncHandler(
	async (req: Request<VerifyUserInput>, res: Response): Promise<any> => {
		const { id, verificationCode } = req.params;

		// find user by id
		const user = await findUserById(id);

		if (!user) return res.sendStatus(404);

		// check if user is verified
		if (user.verified)
			return res.status(400).json({ message: 'User is already verified.' });

		// check verification code is valid
		if (verificationCode === user.verificationCode) {
			user.verified = true;
			await user.save();

			return res.json({ message: 'User successfully verified.' });
		}

		return res.status(400).json({ message: 'Unable to verify user.' });
	}
);

// @desc forgotten password request
// @route POST /user/forgottenpassword
// @access public
const forgottenPasswordHandler = asyncHandler(
	async (
		req: Request<{}, {}, ForgottenPasswordInput>,
		res: Response
	): Promise<any> => {
		const { email } = req.body;

		const message =
			'If an account with that email exists, you will received a password reset link.';

		const user = await findUserByEmail(email);

		if (!user) return res.json({ message });

		if (!user.verified)
			return res.status(400).json({ message: 'User account is not verified.' });

		const passwordResetCode = nanoid();
		user.passwordResetCode = passwordResetCode;
		await user.save();

		const text = `Password reset code: ${user.passwordResetCode}\nUser ID: ${user._id}`;

		await sendMail({
			from: 'noreply@bugscape.net',
			to: user.email,
			subject: 'Reset your password',
			text,
		});

		return res.json({ message });
	}
);

// @desc reset forgotten password
// @route POST /user/resetpassword
// @access public
const resetPasswordHandler = asyncHandler(
	async (
		req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
		res: Response
	): Promise<any> => {
		const { id, passwordResetCode } = req.params;
		const { password } = req.body;

		const user = await findUserById(id);

		if (
			!user ||
			!user.passwordResetCode ||
			user.passwordResetCode !== passwordResetCode
		)
			return res
				.status(400)
				.json({ message: 'Could not reset user password.' });

		// clear password reset code
		user.passwordResetCode = null;

		// change password
		user.password = password;

		await user.save();

		res.json({ message: 'Successfully updated user password.' });
	}
);

// @desc get current user
// @route GET /user/me
// @access private
const getCurrentUserHandler = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		return res.send(res.locals.user);
	}
);

// @desc update user
// @route PATCH /user
// @access private
const updateUserHandler = asyncHandler(
	async (
		req: Request<{}, {}, UpdateUserInput>,
		res: Response
	): Promise<any> => {
		const { _id } = res.locals.user;

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
		const user = await findUserById(_id);

		if (!user) {
			return res.status(400).json({ message: 'User not found.' });
		}

		if (get(updates, 'email')) {
			// check for duplicate email
			const dupicate = await findUserByEmail(String(get(updates, 'email')));

			// only allow updates for original email owner
			if (dupicate && dupicate?._id.toString() !== _id) {
				return res.status(409).json({
					message: 'An account is already registered with that email address.',
				});
			}
		}

		// update user
		updates.forEach(update => {
			updateWith(user, update, () => get(req.body, update));
		});

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
		const { id } = res.locals.user;

		const user = id && (await findUserById(id));

		// check if user has any open tickets assigned
		const tickets = await TicketModel.findOne({ userId: id }).lean().exec();

		if (tickets) {
			return res.status(400).json({ message: 'User has assigned tickets.' });
		}

		// delete user
		const deletedUser = await user.deleteOne();

		res.json({
			message: `Account for ${deletedUser.email} with ID ${deletedUser.id} deleted.`,
		});
	}
);

export default {
	createUserHandler,
	verifyUserHandler,
	forgottenPasswordHandler,
	resetPasswordHandler,
	getCurrentUserHandler,
	getAllUsers,
	updateUserHandler,
	deleteUser,
};
