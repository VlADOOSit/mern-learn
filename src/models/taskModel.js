import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 2
		},
		description: {
			type: String,
			trim: true
		},
		status: {
			type: String,
			enum: ['TODO', 'IN_PROGRESS', 'DONE'],
			default: 'TODO',
			index: true
		},
		deadline: {
			type: Date,
			index: true
		}
	},
	{
		timestamps: true
	}
);

export const Task = mongoose.model('Task', taskSchema);
