import path from 'path';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import config from 'config';

import errorHandler from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import router from '../routes';
import sessionRouter from '../routes/session.routes';
import userRouter from '../routes/user.routes';
import teamRouter from '../routes/team.routes';
import projectRouter from '../routes/project.routes';
import ticketRouter from '../routes/ticket.routes';
import getUser from '../middleware/getUser';
import exp from 'constants';

function createServer() {
	const app = express();

	// middleware
	app.use(logger);
	app.use(
		cors({
			origin: config.get<string>('origin'),
			credentials: true,
		})
	);
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(cookieParser());
	app.use('/', express.static(path.join(__dirname, 'public')));
	app.use(getUser);

	// routes
	app.use('/', router);
	app.use('/session', sessionRouter);
	app.use('/user', userRouter);
	app.use('/team', teamRouter);
	app.use('/project', projectRouter);
	app.use('/ticket', ticketRouter);

	// deal with 404 errors
	app.all('*', (req, res) => {
		res.status(404);

		if (req.accepts('json')) {
			res.json({ message: '404 Not Found' });
		} else {
			res.type('txt').send('404 Not Found');
		}
	});

	app.use(errorHandler);

	return app;
}

export default createServer;
