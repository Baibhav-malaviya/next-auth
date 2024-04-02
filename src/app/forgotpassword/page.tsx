"use client";

import axios from "axios";
import { error } from "console";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordForm = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSentLink = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post("/api/users/resetpassword", { email });
			console.log("RESPONSE: ", response.data);
			if (response.data.status !== 200) {
				throw new Error(response.data.message);
			}
			toast.info("Email sent to reset the password!");
			//navigate to home after 2secs
			setTimeout(() => {
				router.push("/");
			}, 2000);
		} catch (error: any) {
			console.error("Error sending reset password email:", error);
			toast.error(error.message + ". Please check your credential!");
		}
		setLoading(false);
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-900">
			<form
				onSubmit={(e) => handleSentLink(e)}
				className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
			>
				<div className="mb-4">
					<label className="block text-white font-bold mb-2" htmlFor="email">
						Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email"
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div className="flex items-center justify-between">
					<button
						className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
							loading ? "opacity-50 cursor-not-allowed" : ""
						}`}
						type="submit"
						disabled={loading}
					>
						{loading ? "Sending..." : "Send Reset Link"}
					</button>
				</div>
				<ToastContainer />
			</form>
		</div>
	);
};

export default ForgotPasswordForm;

// export default function Page() {
// 	return <div>This is the page to reset the password</div>;
// }
