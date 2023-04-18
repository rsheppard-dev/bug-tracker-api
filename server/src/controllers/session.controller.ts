import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { get } from 'lodash';
import config from 'config';

import { CreateSessionInput } from '../schemas/session.schema';
import {
	generateAccessToken,
	generateRefreshToken,
	createSession,
	findSessions,
	findSessionById,
} from '../services/session.services';
import { verifyJwt } from '../utils/jwt';
import { SessionModel, UserModel } from '../models';

// @desc create session - login
// @route POST /session
// @access public
const createSessionHandler = asyncHandler(
	async (
		req: Request<{}, {}, CreateSessionInput>,
		res: Response
	): Promise<any> => {
		const { email, password } = req.body;

		const message = 'Invalid email or password.';

		const user = await UserModel.findOne({ email }).orFail(new Error(message));

		const isMatch = await user.validatePassword(password);
		if (!isMatch) return res.status(401).json({ message });

		// if (!user.verified)
		// 	return res.redirect(`http://localhost:3000/verify?id=${user.id}`);

		// create a session
		const session = await createSession(user.id, req.get('user-agent'));

		// create an access token
		const accessToken = generateAccessToken(user, session.id);

		// create a refresh token
		const refreshToken = await generateRefreshToken(
			String(user._id),
			String(session._id)
		);

		// create secure cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: config.get<boolean>('secureCookie'),
			sameSite: 'none',
			maxAge: 365 * 24 * 60 * 60 * 1000,
		});

		res.json({
			...user.toJSON(),
			accessToken,
		});
	}
);

// @desc find user sessions
// @route GET /session
// @access private
const getUserSessionsHandler = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const userId = res.locals.user.id;
		console.log(userId);
		const sessions = await findSessions({ userId, valid: true });

		return res.json({ sessions });
	}
);

// @desc refresh access token
// @route GET /session/refresh
// @access public
const refreshTokenHandler = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const message = 'Unauthorised.';

		const { refreshToken } = req.cookies;

		const { decoded, expired } = verifyJwt(
			refreshToken,
			'refreshTokenPublicKey'
		);

		if (!decoded || expired) return res.status(403).json({ message });

		const session = await findSessionById(get(decoded, 'sessionId')!);

		if (!session) return res.status(403).json({ message });

		const user = await UserModel.findById(get(decoded, 'userId')!).orFail(
			new Error(message)
		);

		const accessToken =
			user && session ? generateAccessToken(user, String(session._id)) : null;

		if (!accessToken) return res.status(403).json({ message });

		res.json({ accessToken });
	}
);

// @desc delete session - logout
// @route DELETE /session
// @access private
const deleteSessionHandler = async (req: Request, res: Response) => {
	const session = res.locals.user.sessionId;

	const cookies = req.cookies;

	if (!cookies) return res.sendStatus(204); // no content

	res.clearCookie('refreshToken', {
		httpOnly: true,
		sameSite: 'none',
		secure: config.get<boolean>('secureCookie'),
	});

	if (!session)
		return res.status(404).json({ message: 'Current session not found.' });

	// delete session
	await SessionModel.deleteOne({ _id: session });

	return res.json({ message: 'Successfully logged out.' });
};

export default {
	createSessionHandler,
	getUserSessionsHandler,
	refreshTokenHandler,
	deleteSessionHandler,
};
