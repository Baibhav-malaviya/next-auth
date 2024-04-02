import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "@/models/user.model";
import { getIPAddress } from "./os";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "baibhav.malaviya@gmail.com",
		pass: process.env.MAIL_PASS,
	},
});

//! default mail function
const sendEmail = async (
	to: string,
	subject: string,
	text: string,
	html: string
) => {
	const mailOptions = {
		from: "baibhav.malaviya@gmail.com",
		to,
		subject,
		text,
		html,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Email sent successfully");
	} catch (error) {
		console.error("Error sending email:", error);
		throw error; // Re-throw the error to propagate it further
	}
};

//! specified email function
export const sendRegistrationConfirmationEmail = async (
	email: string,
	userId: any
) => {
	const hashedToken = await bcrypt.hash(userId.toString(), 10);
	await User.findByIdAndUpdate(userId, {
		$set: {
			verificationToken: hashedToken,
			verificationTokenExpires: Date.now() + 3600000,
		},
	});

	const subject = `User verification`;
	const html = `<p>
	Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to
	verify your email or copy and paste the link below in your browser <br/>
	${process.env.DOMAIN}/verifyemail?token=${hashedToken}
	</p>`;

	try {
		await sendEmail(email, subject, "", html);
		console.log("User verification mail send successfully");
	} catch (error) {
		console.error("Error sending registration verification email:", error);
		throw error; // Re-throw the error to propagate it further
	}
};
export const sendLoginEmail = async (userEmail: string) => {
	const subject = "New login on Malaviya Production House";
	const text = `Hello, you have successfully logged in to your account.`;
	const html = `
	<html>
		<head>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
					margin: 0;
					padding: 0;
				}
				.container {
					max-width: 600px;
					margin: 0 auto;
					padding: 20px;
					background-color: #fff;
					border-radius: 10px;
					box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
				}
				h1 {
					color: #007bff;
				}
				h1 p {
					font-size: 16px; 
				}
				p {
					color: #555;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h1>Login Alert: New IPAddress detected <p>${getIPAddress()}</p></h1>
				<p>You have successfully logged in to your account.</p>
				<p>Best regards,<br> Baibhav Malaviya<br> CTO of Malaviya Production</p>
			</div>
		</body>
	</html>
`;

	try {
		await sendEmail(userEmail, subject, text, html);
		console.log(`Login email sent successfully to ${userEmail}`);
	} catch (error) {
		console.error(`Error sending login email to ${userEmail}:`, error);
		throw error;
	}
};
export const sendForgotPasswordEmail = async (email: string) => {
	try {
		// Find the user by email
		const user = await User.findOne({ email });

		if (!user) {
			throw new Error("User with this email not found");
		}

		// Generate a reset password token and expiry time
		const resetPasswordToken = await bcrypt.hash(user._id.toString(), 10);
		const resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

		// Update the user document with the reset token and expiry
		await User.findByIdAndUpdate(user.id, {
			$set: {
				resetPasswordToken,
				resetPasswordExpires,
			},
		});

		const subject = "Reset Password";
		const resetUrl = `${process.env.DOMAIN}/updatepassword?token=${resetPasswordToken}`;
		const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
		<h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h2>
		<p style="color: #555; line-height: 1.5;">You have requested to reset your password.</p>
		<p style="color: #555; line-height: 1.5;">Click the link below to reset your password or copy and paste the link into your browser:</p>
		<a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Reset Password</a>
		<p style="color: #555; line-height: 1.5;">${resetUrl}</p>
		<p style="color: #555; line-height: 1.5;">This reset password link is valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
		<p style="color: #777; margin-top: 30px;">If you have any questions or concerns, please contact our support team.</p>
	  </div>
    `;

		await sendEmail(email, subject, "", html);
		console.log("Forgot password email sent successfully");
	} catch (error) {
		console.error("Error sending forgot password email:", error);
		throw error; // Re-throw the error to propagate it further
	}
};
export const sendPasswordResetSuccessEmail = async (
	userEmail: string,
	userName: string,
	newPassword: string
) => {
	const subject = "Password Reset Successful";
	const text = `Hi ${userName},\n\nYour password has been reset successfully. Your new password is: ${newPassword}\n\nPlease log in with your new password.\n\nBest regards,\nYour App Team`;
	const html = `
	  <html>
		<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
		  <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
			<h2 style="color: #333333; margin-top: 0;">Hi ${userName},</h2>
			<p style="color: #555555;">Your password has been reset successfully. Your new password is:</p>
			<p style="color: #555555; font-weight: bold;">${newPassword}</p>
			<p style="color: #555555;">Please log in with your new password.</p>
			<p style="color: #555555;">Best regards,<br>Your App Team</p>
			<div style="text-align: center; margin-top: 20px;">
			  <a href=${process.env.DOMAIN} style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Visit Our Website</a>
			</div>
		  </div>
		</body>
	  </html>
	`;

	try {
		await sendEmail(userEmail, subject, text, html);
		console.log(`Password reset success email sent to ${userEmail}`);
	} catch (error) {
		console.error("Error sending password reset success email:", error);
		// Handle the error appropriately (e.g., log, display a user-friendly message, etc.)
	}
};

export default sendEmail;
