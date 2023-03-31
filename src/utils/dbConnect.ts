import mongoose from 'mongoose';
import config from 'config';

const dbUri = config.get<string>('dbUri');

async function dbConnect() {
	try {
		await mongoose.connect(dbUri);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

export default dbConnect;
