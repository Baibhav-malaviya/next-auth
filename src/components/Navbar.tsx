import Link from "next/link";
import React from "react";

type NavbarProps = {
	// Add any additional props if needed
};

const Navbar: React.FC<NavbarProps> = () => {
	return (
		<nav className="bg-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<Link href="/">
							<span className="text-white font-bold text-xl">Home</span>
						</Link>
					</div>
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-4">
							<Link href="/signup">
								<span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
									Signup
								</span>
							</Link>
							<Link href="/login">
								<span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
									Login
								</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
