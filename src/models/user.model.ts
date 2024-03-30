import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	avatar: string;
	isAdmin: boolean;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
	verificationToken?: string;
	verificationTokenExpires?: Date;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: "default-avatar.png",
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		verificationToken: String,
		verificationTokenExpires: Date,
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<IUser> =
	mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;
