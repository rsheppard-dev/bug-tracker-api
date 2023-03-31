import type { NextFunction, Response, Request } from 'express';

function auth(req: Request, res: Response, next: NextFunction) {
	const user = res.locals.user;

	if (!user) return res.sendStatus(403);

	return next();
}

export default auth;
