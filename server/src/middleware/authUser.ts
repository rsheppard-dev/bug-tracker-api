import type { NextFunction, Response, Request } from 'express';

function authUser(req: Request, res: Response, next: NextFunction) {
	const user = res.locals.user;

	if (!user) return res.status(403).json({ message: 'You need to sign in.' });

	return next();
}

export default authUser;
