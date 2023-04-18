import type { NextFunction, Response, Request } from 'express';
import { get } from 'lodash';

import { verifyJwt } from '../utils/jwt';
import { User } from '../models/user.model';
import { UserModel } from '../models';

async function getUser(req: Request, res: Response, next: NextFunction) {
	const authHeader = (req.headers.authorization ||
		req.headers.Authorization) as string;

	if (!authHeader?.startsWith('Bearer ')) {
		return next();
	}

	const token = authHeader.split(' ')[1];

	const { decoded, expired } = verifyJwt<User>(token, 'accessTokenPublicKey');

	if (!decoded || expired) {
		return next();
	}

	const user = await UserModel.findById(get(decoded, 'id'));

	if (!user) return next();

	res.locals.user = user;

	return next();
}

export default getUser;
