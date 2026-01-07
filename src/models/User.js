import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		passwordHash: {
			type: String,
			required: true,
			select: false
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		}
	},
	{
		timestamps: true
	}
);

export const User = mongoose.model('User', userSchema);
