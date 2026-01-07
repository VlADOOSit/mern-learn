import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true
		},
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

taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, deadline: 1 });

export const Task = mongoose.model('Task', taskSchema);
