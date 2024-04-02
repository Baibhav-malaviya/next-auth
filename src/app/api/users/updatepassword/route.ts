import connectDB from "@/connectDB/connectDB";
import { sendPasswordResetSuccessEmail } from "@/helper/mailer";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
	try {
		const reqBody = await req.json();
		const { newPassword, token } = reqBody;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return NextResponse.json({
				status: 400,
				message: "Token is expired",
				success: false,
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(newPassword, salt);
		await User.findByIdAndUpdate(user._id, {
			$set: {
				password: hashPassword,
			},
		});

		await User.findByIdAndUpdate(user._id, {
			$set: {},
		});

		await sendPasswordResetSuccessEmail(user.email, user.username, newPassword);
		return NextResponse.json({
			status: 200,
			message: "Password updated successfully",
			success: true,
		});
	} catch (error) {
		console.log("Error in update password");
		return NextResponse.json({
			success: false,
			status: 500,
			message: "Error in update password",
		});
	}
}
