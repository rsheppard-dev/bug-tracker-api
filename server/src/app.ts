import * as dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import mongoose from 'mongoose';

import { logEvents } from './middleware/logger';
import dbConnect from './utils/dbConnect';
import createServer from './utils/server';

const PORT = config.get<number>('port');

const app = createServer();

// connect to database
dbConnect();

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', error => {
	console.log(error);
	logEvents(
		`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
		'mongoErrLog.log'
	);
});
