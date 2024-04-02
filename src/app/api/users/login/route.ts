import connectDB from "@/connectDB/connectDB";
import { sendLoginEmail } from "@/helper/mailer";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const reqBody = await req.json();
		const { email, password } = reqBody;

		if (!email || !password) {
			return NextResponse.json({
				success: false,
				message: "Email and password is  required field",
				status: 400,
			});
		}
		const user = await User.findOne({ email });
		if (!user)
			return NextResponse.json({
				success: false,
				message: "User with this email is not registered!",
				status: 400,
			});

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword)
			return NextResponse.json({
				success: false,
				message: "Incorrect Password",
				status: 400,
			});

		interface JWTPayload {
			id: string;
			email: string;
			username: string;
		}

		const tokenData: JWTPayload = {
			id: user._id,
			email: user.email,
			username: user.username,
		};
		const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
			expiresIn: "1d",
		});

		const response = NextResponse.json({
			success: true,
			message: "user logged in successfully",
			status: 200,
		});

		interface CookieOptions {
			httpOnly: boolean;
			secure: boolean;
			sameSite: "lax" | "strict" | "none";
		}

		const options: CookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		};

		response.cookies.set("token", token, options);
		await sendLoginEmail(user.email);
		return response;
	} catch (error) {
		return NextResponse.json({
			success: false,
			message: "Error in log in",
			status: 500,
		});
	}
}
