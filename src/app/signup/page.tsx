"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignupForm = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setError("");
		try {
			setLoading(true);
			const response = await axios.post("/api/users/signup", {
				email,
				username,
				password,
			});

			setLoading(false);
			console.log("RESPONSE: ", response);
			if (response.data.success === false) {
				throw new Error(response.data.message);
			}

			toast.success("Logged in successfully");
			router.push("/login");
		} catch (error: any) {
			let errorMessage;
			if (error.response) {
				// Server responded with an error status code (e.g., 404, 500)
				errorMessage = `Server Error: ${error.response.status}`;
			} else if (error.request) {
				// Request was made but no response received
				errorMessage = "No response from server";
			} else {
				// Something else happened while setting up the request
				errorMessage = `Error: ${error.message}`;
			}
			setError(errorMessage);
		}
	};

	return (
		<div className="flex justify-center flex-col items-center h-screen bg-gray-900">
			<p className="text-sm my-2">
				Already a user?{" "}
				<Link className="underline hover:no-underline" href={"/login"}>
					log in
				</Link>
			</p>
			<form
				onSubmit={handleSubmit}
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
						onChange={(e) => {
							setError("");
							setEmail(e.target.value);
						}}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-white font-bold mb-2" htmlFor="username">
						Username
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
						type="text"
						placeholder="Enter your username"
						value={username}
						onChange={(e) => {
							setError("");
							setUsername(e.target.value);
						}}
						required
					/>
				</div>
				<div className="mb-6">
					<label className="block text-white font-bold mb-2" htmlFor="password">
						Password
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => {
							setError("");
							setPassword(e.target.value);
						}}
						required
					/>
				</div>
				{error && (
					<p className="text-red-500 text-sm mb-4">
						{error + " ,Please check your credential!"}
					</p>
				)}
				<div className="flex items-center justify-between">
					<button
						className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
							loading ? "opacity-50 cursor-not-allowed" : ""
						}`}
						type="submit"
						disabled={loading}
					>
						{loading ? "Loading..." : "Sign Up"}
					</button>
				</div>
				<ToastContainer />
			</form>
		</div>
	);
};

export default SignupForm;
