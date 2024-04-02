import connectDB from "@/connectDB/connectDB";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export const getDataFromToken = (req: NextRequest) => {
	try {
		const token = req.cookies.get("token")?.value || "";
		const tokenData: any = jwt.verify(token, process.env.JWT_SECRET!);
		return tokenData.id;
	} catch (error) {
		console.log("Error in getting token data");
		return;
	}
};
