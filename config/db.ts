import mongoose from 'mongoose';

const DATABASE_URI = process.env.DATABASE_URI!;

async function connectDB() {
	try {
		await mongoose.connect(DATABASE_URI);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

export default connectDB;
