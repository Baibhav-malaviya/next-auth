import React, { useState, Suspense } from "react";
import axios from "axios";
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
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex justify-center items-center h-screen bg-gray-900">
				<form
					onSubmit={handleSubmit}
					className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
				>
					{/* Form content */}
				</form>
			</div>
		</Suspense>
	);
};

export default UpdatePassword;
