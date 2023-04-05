import { NextFunction, Request, Response } from 'express';

function authRole(team: string, role: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!res.locals.user.roles.includes({ team, role })) {
			return res.send(401).json({ message: 'Not authorised.' });
		}

		return next();
	};
}

export default authRole;
