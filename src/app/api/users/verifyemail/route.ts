import connectDB from "@/connectDB/connectDB";
import User from "@/models/user.model";
import sendEmail from "@/helper/mailer";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const reqBody = await req.json();
		const { token } = reqBody;

		if (!token) {
			return NextResponse.json({
				success: false,
				message: "Token not available",
				status: 400,
			});
		}

		const user = await User.findOne({
			verificationToken: token,
			verificationTokenExpires: { $gt: Date.now() },
		});

		if (!user) {
			return NextResponse.json({
				success: false,
				message: "Verification token is expire or incorrect",
				status: 400,
			});
		}

		user.isVerified = true;
		user.verificationTokenExpires = undefined;
		user.verificationToken = undefined;
		await user.save();

		const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to [Company Name]</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background-color: #f9f9f9;
    }
    h1 {
      color: #007bff;
    }
    p {
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Malaviya Production!</h1>
    <p>Your account verification is complete. Enjoy full access to our services and support. Contact us anytime for assistance. Thank you for choosing us!</p>
    <p>Best regards,<br> Baibhav Malaviya<br> CTO of Malaviya Production</p>
  </div>
</body>
</html>
`;
		await sendEmail(user.email, "User verification", "", emailHTML);

		return NextResponse.json({
			success: true,
			message: "User verified successfully",
			status: 400,
		});
	} catch (error) {
		console.log("Error in verification of user: ", error);
		return NextResponse.json({
			success: false,
			message: "Error in user verification.",
			status: 500,
		});
	}
}
