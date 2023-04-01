import type { Request, Response, NextFunction } from 'express';

import { logEvents } from './logger';

function errorHandler(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	logEvents(
		`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
		'errLog.log'
	);

	console.log(error.stack);

	// typegoose error checks
	if (error.code === 11000) {
		return res
			.status(409)
			.json({ message: 'Account already exists with that email address.' });
	}

	// set error status
	const status = res.statusCode ? res.statusCode : 500;
	res.status(status);

	res.json({ error, message: error.message });

	next();
}

export default errorHandler;
