import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
let server;

const startServer = async () => {
	try {
		await connectDB();
		server = app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

const gracefulShutdown = async (signal) => {
	console.log(`${signal} received: closing server`);
	if (server) {
		await new Promise((resolve) => server.close(resolve));
	}
	await mongoose.connection.close();
	process.exit(0);
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
	process.on(signal, () => gracefulShutdown(signal));
});

startServer();
