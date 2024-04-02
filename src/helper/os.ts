import os from "os";

export const getIPAddress = () => {
	const os = require("os");

	// Get the network interfaces
	const networkInterfaces = os.networkInterfaces();

	// Extract all IPv4 addresses
	const ipv4Addresses = Object.values(networkInterfaces)
		.flat()
		.filter((iface: any) => iface.family === "IPv4")
		.map((iface: any) => iface.address);

	return ipv4Addresses[0];
};
