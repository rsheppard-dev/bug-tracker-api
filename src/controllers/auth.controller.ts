import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { CreateSessionInput } from '../schemas/auth.schema';
import {
	findSessionById,
	generateAccessToken,
	generateRefreshToken,
} from '../services/auth.services';
import { findUserByEmail, findUserById } from '../services/user.services';
import { verifyJwt } from '../utils/jwt';

// @desc create session
// @route POST /auth/login
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
			return res.status(400).json({
				message: 'You must verify your email to activate this account.',
			});

		const isMatch = await user.validatePassword(password);
		if (!isMatch) return res.status(401).json({ message });

		// create an access token
		const accessToken = generateAccessToken(user);

		// create a refresh token
		const refreshToken = await generateRefreshToken({
			userId: user._id.toString(),
		});

		// create secure cookie with refresh token
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 365 * 24 * 60 * 60 * 1000, // expire in 1 year
		});

		res.json({ accessToken });
	}
);

// @desc refresh access token
// @route GET /auth/refresh
// @access public
const refreshAccessTokenHandler = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const message = 'Could not refresh access token.';

		const cookies = req.cookies;

		if (!cookies?.refreshToken) {
			return res.status(401).json({ message });
		}

		const refreshToken = cookies.refreshToken;

		const decoded = verifyJwt<{ session: string }>(
			refreshToken,
			'refreshTokenPublicKey'
		);

		if (!decoded) {
			return res.status(403).json({ message });
		}

		const session = await findSessionById(decoded.session);

		if (!session || !session.valid) {
			return res.status(403).json({ message });
		}

		const user = await findUserById(String(session.user));

		if (!user) {
			return res.status(401).json({ message });
		}

		const accessToken = generateAccessToken(user);

		return res.json({ accessToken });
	}
);

// @desc logout / delete session
// @route POST /auth/logout
// @access public
const deleteSessionHandler = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.refreshToken) return res.sendStatus(204); // no content: ;

	res.clearCookie('refreshToken', {
		httpOnly: true,
		sameSite: 'none',
		secure: true,
	});

	res.json({ message: 'Cookie cleared.' });
};

export default {
	createSessionHandler,
	refreshAccessTokenHandler,
	deleteSessionHandler,
};
