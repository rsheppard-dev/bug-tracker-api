import { rateLimit } from 'express-rate-limit';

import { logEvents } from './logger';

const loginLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5, // limit each ip to 5 login requests per window, per minute
	message: {
		message:
			'Too many login attempts from this IP, please try again after 1 minute.',
	},
	handler: (req, res, next, options) => {
		logEvents(
			`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
			'errLog.log'
		);

		res.status(options.statusCode).send(options.message);
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export default loginLimiter;
