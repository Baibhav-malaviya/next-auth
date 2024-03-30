import connectDB from "@/connectDB/connectDB";
import { sendRegistrationConfirmationEmail } from "@/helper/mailer";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const reqBody = await req.json();
		const { username, email, password } = reqBody;
		console.log("requested body: ", reqBody);

		const user = await User.findOne({ email });

		if (user) {
			return NextResponse.json({
				success: false,
				message: "User already exist",
				status: 400,
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const newUser = new User({ username, email, password: hashPassword });

		const savedUser = await newUser.save();
		console.log(savedUser);

		// send mail for the verification
		await sendRegistrationConfirmationEmail(email, newUser._id);

		return NextResponse.json({
			success: true,
			message: "User registered successfully",
			status: 200,
			data: newUser,
		});
	} catch (error) {
		console.log("Error in user registration.");
		return NextResponse.json({
			success: false,
			message: "Error in registering the user",
			status: 500,
		});
	}
}
