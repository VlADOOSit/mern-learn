import mongoose from 'mongoose';

const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true
		},
		tokenHash: {
			type: String,
			required: true,
			unique: true,
			index: true
		},
		revoked: {
			type: Boolean,
			default: false
		},
		expiresAt: {
			type: Date,
			required: true,
			index: true
		},
		replacedByTokenHash: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
