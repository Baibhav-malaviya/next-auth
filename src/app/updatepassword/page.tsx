"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const UpdatePassword = () => {
	const router = useRouter();
	const [newPassword, setNewPassword] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const searchParams = useSearchParams();
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const token = searchParams.get("token");

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			setSuccess(false);
			return;
		}

		try {
			// Password validation logic...
			setIsUpdating(true);
			const response = await axios.post("/api/users/updatepassword", {
				newPassword,
				token,
			});
			setIsUpdating(false);

			if (response.data.status !== 200) {
				throw new Error(response.data.message);
			}

			toast.success("Password updated successfully. Redirecting to login...");

			// Update password logic...

			// Reset form fields
			setNewPassword("");
			setConfirmPassword("");
			setError("");
			setSuccess(true);

			// Redirect to login after a delay
			setTimeout(() => {
				router.push("/login");
			}, 3000);
		} catch (error: any) {
			console.error("Error updating password:", error);
			toast.error(error.message);
			setError(
				"An error occurred while updating the password. Please try again."
			);
		}
	};
	return (
		<>
			<div className="flex justify-center items-center h-screen bg-gray-900">
				<form
					onSubmit={handleSubmit}
					className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
				>
					<div className="mb-4">
						<label
							className="block text-white font-bold mb-2"
							htmlFor="newPassword"
						>
							New Password
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="newPassword"
							type="password"
							placeholder="Enter your new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-white font-bold mb-2"
							htmlFor="confirmPassword"
						>
							Confirm Password
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							id="confirmPassword"
							type="password"
							placeholder="Confirm your new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
					{success && (
						<p className="text-green-500 text-sm mb-4">
							Password updated successfully!
						</p>
					)}
					<div className="flex items-center justify-between">
						<button
							className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
								isUpdating && "opacity-90"
							}`}
							type="submit"
							disabled={isUpdating}
						>
							{isUpdating ? "Updating..." : "Update Password"}
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default UpdatePassword;
