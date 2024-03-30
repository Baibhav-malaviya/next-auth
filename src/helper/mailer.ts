import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "@/models/user.model";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "baibhav.malaviya@gmail.com",
		pass: process.env.MAIL_PASS,
	},
});

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

export const sendRegistrationConfirmationEmail = async (
	email: string,
	userId: any
) => {
	const hashedToken = await bcrypt.hash(userId.toString(), 10);
	await User.findByIdAndUpdate(userId, {
		verificationToken: hashedToken,
		verificationTokenExpires: Date.now() + 3600000,
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

export default sendEmail;
