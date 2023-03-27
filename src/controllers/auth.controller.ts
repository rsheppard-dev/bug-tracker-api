import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { verify } from 'jsonwebtoken';
import { UserModel } from '../models';

// @desc login
// @route POST /auth
// @access public
const login = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const user = await UserModel.findOne(req.body.email);

		if (!user) {
			return res
				.status(401)
				.json({ message: 'Unable to match email or password.' });
		}

		const isMatch = user.validatePassword(req.body.password);

		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		// create secure cookie with refresh token
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({ accessToken });
	}
);

// @desc refresh token
// @route POST /auth/refresh
// @access public
const refresh = async function (req: Request, res: Response) {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorised.' });

	const refreshToken = cookies.jwt;
	const secret = process.env.REFRESH_TOKEN_SECRET!;

	const decoded = verify(refreshToken, secret) as { id: string } | undefined;

	const user = await UserModel.findById(decoded?.id);

	if (!user) return res.status(401).json({ message: 'Unauthorised.' });

	const accessToken = user.generateAccessToken();

	res.json({ accessToken });
};

// @desc logout
// @route POST /auth/logout
// @access public
const logout = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(204); // no content

	res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

	res.json({ message: 'Cookie cleared.' });
};

export default { login, refresh, logout };
