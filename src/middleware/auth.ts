import type { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';

import type { IUser } from '../interfaces/IUser';

function auth(req: Request, res: Response, next: NextFunction) {
	const authHeader =
		req.headers.authorization ||
		(req.headers.Authorization as string | undefined);

	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorised.' });
	}

	const accessToken = authHeader?.split(' ')[1]!;
	const secret = process.env.ACCESS_TOKEN_SECRET!;

	const decoded = verify(accessToken, secret) as
		| Pick<IUser, 'id' | 'email' | 'roles'>
		| undefined;

	if (decoded) {
		// @ts-ignore
		req.userId = decoded?.id;
		// @ts-ignore
		req.email = decoded?.email;
		// @ts-ignore
		req.roles = decoded?.roles;
	} else return res.status(401).json({ message: 'Unauthorised.' });

	next();
}

export default auth;
