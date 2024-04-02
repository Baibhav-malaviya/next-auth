import connectDB from "@/connectDB/connectDB";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const response = NextResponse.json({
			success: true,
			message: "User logged out successfully",
			status: 200,
		});

		interface CookieOptions {
			httpOnly: boolean;
			secure: boolean;
			sameSite: "lax" | "strict" | "none";
			name: string; // Add the name property
		}

		const options: CookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			name: "token", // Provide the cookie name
		};

		response.cookies.delete(options);

		return response;
	} catch (error) {
		return NextResponse.json({
			success: false,
			message: "Error in logout",
			status: 500,
		});
	}
}
