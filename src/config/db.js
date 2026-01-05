import mongoose from 'mongoose';

export const connectDB = async () => {
	const mongoUrl = process.env.MONGO_URL;

	if (!mongoUrl) {
		throw new Error('MONGO_URL is not defined in the environment variables');
	}

	await mongoose.connect(mongoUrl, {
		autoIndex: true
	});

	return mongoose.connection;
};
