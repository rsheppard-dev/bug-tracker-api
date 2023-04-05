import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { get } from 'lodash';

import {
	CreateSessionInput,
	RefreshTokenInput,
} from '../schemas/session.schema';
import {
	generateAccessToken,
	generateRefreshToken,
	createSession,
	findSessions,
	updateSession,
	findSessionById,
} from '../services/session.services';
import { findUserByEmail, findUserById } from '../services/user.services';
import { verifyJwt } from '../utils/jwt';

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

		const user = await findUserByEmail(email);

		if (!user) return res.status(401).json({ message });

		if (!user.verified)
			return res.status(401).json({
				message: 'You must verify your email to activate this account.',
			});

		const isMatch = await user.validatePassword(password);
		if (!isMatch) return res.status(401).json({ message });

		// create a session
		const session = await createSession(
			String(user._id),
			req.get('user-agent')
		);

		// create an access token
		const accessToken = generateAccessToken(user, String(session._id));

		// create a refresh token
		const refreshToken = await generateRefreshToken(
			String(user._id),
			String(session._id)
		);

		res.json({
			...user,
			sessionId: session._id,
			accessToken,
			refreshToken,
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
// @route POST /session/refresh
// @access public
const refreshTokenHandler = asyncHandler(
	async (
		req: Request<{}, {}, RefreshTokenInput>,
		res: Response
	): Promise<any> => {
		const message = 'Unauthorised.';

		const { refreshToken } = req.body;

		const { decoded, expired } = verifyJwt(
			refreshToken,
			'refreshTokenPublicKey'
		);

		if (!decoded || expired) return res.status(403).json({ message });

		const session = await findSessionById(get(decoded, 'sessionId')!);

		if (!session) return res.status(403).json({ message });

		const user = await findUserById(get(decoded, 'userId')!);

		if (!user) return res.status(403).json({ message });

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

	if (!session)
		return res.status(404).json({ message: 'Current session not found.' });

	// find session by id and change valid status to false
	await updateSession({ _id: session }, { valid: false });

	return res.json({ message: 'Successfully logged out.' });
};

export default {
	createSessionHandler,
	getUserSessionsHandler,
	refreshTokenHandler,
	deleteSessionHandler,
};
