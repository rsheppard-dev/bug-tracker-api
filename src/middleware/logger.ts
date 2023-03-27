import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import type { Request, Response, NextFunction } from 'express';

async function logEvents(message: string, logFileName: string) {
	const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

	try {
		// check if logs directory exists and if not create it
		if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
		}

		await fsPromises.appendFile(
			path.join(__dirname, '..', 'logs', logFileName),
			logItem
		);
	} catch (error) {
		console.log(error);
	}
}

function logger(req: Request, res: Response, next: NextFunction) {
	logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');

	console.log(`${req.method} ${req.path}`);

	next();
}

export { logEvents, logger };
