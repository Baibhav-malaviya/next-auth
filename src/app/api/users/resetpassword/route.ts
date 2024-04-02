import connectDB from "@/connectDB/connectDB";
import { sendForgotPasswordEmail } from "@/helper/mailer";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
	try {
		const reqBody = await req.json();
		const { email } = reqBody;

		if (!email)
			return NextResponse.json({
				success: false,
				status: 400,
				message: "Email not available",
			});

		await sendForgotPasswordEmail(email);
		return NextResponse.json({
			success: true,
			status: 200,
			message: "Reset password mail sent successfully",
		});
	} catch (error) {
		console.log("Error in resetpassword");
		return NextResponse.json({
			success: false,
			status: 500,
			message: "Error in resetpassword",
		});
	}
}
