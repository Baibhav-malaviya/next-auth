import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

interface VerifyEmailResponse {
	success: boolean;
	message: string;
}

const VerifyEmail = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState<boolean>(true); // Initially set to true to show loading fallback
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const handleVerifyEmail = async () => {
		setIsLoading(true);
		setError("");

		try {
			const token = searchParams.get("token");
			if (!token) {
				throw new Error("Token not provided");
			}

			const response = await axios.post("/api/users/verifyemail", { token });
			console.log("Response:", response.data);

			if (response.data.success) {
				setIsVerified(true);
			} else {
				setError(response.data.message);
			}
		} catch (error) {
			console.error("Error verifying email:", error);
			setError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const redirectToDashboard = () => {
			if (isVerified) {
				setTimeout(() => {
					router.push("/");
				}, 2000);
			}
		};

		redirectToDashboard();
	}, [isVerified, router]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex flex-col justify-center items-center h-screen bg-gray-900">
				{error && <p className="text-red-500 mb-4">{error}</p>}
				{isVerified ? (
					<>
						<p className="text-white mb-4 bg-gray-700/50 rounded p-3">
							Email verified successfully!
						</p>
						<p className="text-white bg-gray-700/50 rounded p-3">
							Redirecting to dashboard...
						</p>
					</>
				) : (
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						onClick={handleVerifyEmail}
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Verify Email"}
					</button>
				)}
			</div>
		</Suspense>
	);
};

export default VerifyEmail;
