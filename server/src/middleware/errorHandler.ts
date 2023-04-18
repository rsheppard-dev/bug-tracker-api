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

	// set error status
	const status = res.statusCode ? res.statusCode : 500;
	res.status(status);

	res.json({ error, message: error.message });

	next();
}

export default errorHandler;
