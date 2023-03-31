import type { Request, Response, NextFunction } from 'express';

import { verifyJwt } from '../utils/jwt';

async function deserializeUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const accessToken =
		req.headers.authorization &&
		req.headers.authorization.replace('Bearer ', '');

	if (!accessToken) return next();

	const decoded = verifyJwt(accessToken, 'accessTokenPublicKey');

	if (decoded) res.locals.user = decoded;

	return next();
}

export default deserializeUser;
