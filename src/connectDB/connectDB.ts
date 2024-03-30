import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;
const DB_NAME = "nextAuth";

interface ConnectionOptions extends ConnectOptions {
	useNewUrlParser?: boolean;
	useUnifiedTopology?: boolean;
}

let cachedConnection: mongoose.Connection | null = null;

async function connectDB() {
	if (cachedConnection) {
		return cachedConnection;
	}

	try {
		const options: ConnectionOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};

		const connection = await mongoose.connect(
			`${MONGODB_URI}/${DB_NAME}`,
			options
		);
		cachedConnection = connection.connection;

		cachedConnection.on("error", (err) => {
			console.error("MongoDB connection error:", err);
		});

		cachedConnection.once("open", () => {
			console.log(`Connected to MongoDB at ${MONGODB_URI}`);
		});

		cachedConnection.on("disconnected", () => {
			console.log("MongoDB disconnected");
		});
	} catch (error) {
		console.error("Failed to connect to MongoDB: ");
		process.exit(1);
	}

	return cachedConnection;
}

export default connectDB;
