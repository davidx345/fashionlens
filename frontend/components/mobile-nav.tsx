"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MountainIcon, LogOut, UserCircle, LogIn, UserPlus } from "lucide-react"; // Added LogOut, UserCircle, LogIn, UserPlus
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"; // Added SheetTitle
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore"; // Import useStore
import { logoutUser as apiLogoutUser } from "@/app/api/services/auth-service"; // Import logoutUser

// Default nav items for authenticated users
const authenticatedNavItems = [
	{ href: "/dashboard", title: "Dashboard", icon: undefined, disabled: false },
	{ href: "/dashboard/analyze", title: "Outfit Analyzer", icon: undefined, disabled: false },
	{ href: "/dashboard/wardrobe", title: "Wardrobe", icon: undefined, disabled: false },
	{ href: "/dashboard/recommendations", title: "Recommendations", icon: undefined, disabled: false },
	{ href: "/pricing", title: "Pricing", icon: undefined, disabled: false },
	{ href: "/about", title: "About", icon: undefined, disabled: false },
];

// Default nav items for non-authenticated users
const publicNavItems = [
	{ href: "/", title: "Home", icon: undefined, disabled: false },
	{ href: "/pricing", title: "Pricing", icon: undefined, disabled: false },
	{ href: "/about", title: "About", icon: undefined, disabled: false },
];

interface MobileNavProps {
	navItems?: Array<{
		href: string;
		title: string;
		icon?: React.ReactNode;
		disabled?: boolean;
	}>;
	// Add other props like user status for conditional rendering of login/logout
}

export function MobileNav({ navItems }: MobileNavProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, user, logout } = useStore();

	// Use appropriate nav items based on authentication state
	const defaultNavItems = isAuthenticated ? authenticatedNavItems : publicNavItems;
	const currentNavItems = navItems || defaultNavItems;

	const toggleSheet = () => setIsOpen(!isOpen);

	const handleLogout = async () => {
		await apiLogoutUser();
		logout(); // Clears user state and sets isAuthenticated to false
		setIsOpen(false); // Close the sheet
		router.push("/login");
	};

	const sheetVariants = {
		closed: {
			x: "-100%",
			transition: { type: "tween", ease: "easeInOut", duration: 0.3 },
		},
		open: {
			x: "0%",
			transition: { type: "tween", ease: "easeInOut", duration: 0.3 },
		},
	};

	const navListVariants = {
		closed: { opacity: 0 },
		open: {
			opacity: 1,
			transition: { staggerChildren: 0.08, delayChildren: 0.2 },
		},
	};

	const navItemVariants = {
		closed: { opacity: 0, y: -10 },
		open: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 260, damping: 20 },
		},
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{/* New Mobile Header Bar */}
			<div className="md:hidden flex items-center justify-between w-full px-3 py-2 text-foreground bg-background"> {/* MODIFIED: bg-background/90 to bg-background for a solid color */}
				{/* Logo and Site Name on the left */}
				<div className="flex items-center gap-2">
					<MountainIcon className="h-6 w-6 text-primary" />
					<span className="font-semibold text-lg">FashionLens</span>
				</div>

				{/* SheetTrigger button on the right */}
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						className="p-2 text-foreground hover:bg-primary/10 hover:text-primary focus:ring-2 focus:ring-primary active:bg-primary/20"
						aria-label="Toggle Menu"
					>
						<Menu className="h-6 w-6" />
					</Button>
				</SheetTrigger>
			</div>

			<AnimatePresence>
				{isOpen && (
					<SheetContent
						side="left"
						className="w-full max-w-[300px] sm:max-w-[320px] p-0 bg-background border-r-0 shadow-2xl shadow-primary/30" // Changed bg-gray-900 to bg-background, shadow-purple-500/30 to shadow-primary/30
						// Remove default close button provided by SheetContent if we use a custom one
						// showCloseButton={false}
					>
						<VisuallyHidden>
							<SheetTitle>Mobile Navigation Menu</SheetTitle>
						</VisuallyHidden>
						<motion.div
							initial="closed"
							animate="open"
							exit="closed"
							variants={sheetVariants}
							className="flex flex-col h-full"
						>
							<div className="flex items-center justify-start p-5 border-b border-border/80"> {/* Changed border-gray-700/80 to border-border/80 */}
								<Link
									href="/"
									className="flex items-center gap-2.5"
									onClick={toggleSheet}
								>
									<MountainIcon className="h-7 w-7 text-primary" /> {/* Changed text-purple-400 to text-primary */}
									<span className="text-xl font-bold text-foreground"> {/* Changed text-white to text-foreground */}
										FashionLens
									</span>
								</Link>
								{/* Removed custom X button to avoid duplication with SheetContent's default close button
								<Button
									variant="ghost"
									size="icon"
									onClick={toggleSheet}
									className="text-gray-400 hover:text-white hover:bg-purple-700/50"
								>
									<X className="h-5 w-5" />
									<span className="sr-only">Close menu</span>
								</Button>
								*/}
							</div>							<motion.nav
								variants={navListVariants}
								className="flex-grow px-3 py-5 space-y-1.5 overflow-y-auto"
							>
								{currentNavItems.map(
									(item) =>
										!item.disabled &&
										item.href && (
											<motion.div key={item.href} variants={navItemVariants}>
												<Link
													href={item.href}
													className={cn(
														"flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-all duration-150 ease-in-out",
														pathname === item.href
															? "bg-primary text-primary-foreground shadow-sm"
															: "text-muted-foreground hover:bg-primary/10 hover:text-primary"
													)}
													onClick={toggleSheet}
												>
													{item.icon && <span className="mr-3">{item.icon}</span>} {/* Display icon if provided */}
													{item.title}
												</Link>
											</motion.div>
										)
								)}
								{/* Conditional Logout/Profile or Login/Signup links */}
								{isAuthenticated && user ? (
									<>
										<motion.div variants={navItemVariants}>
											<Link
												href="/dashboard/settings"
												className={cn(
													"flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-all duration-150 ease-in-out",
													pathname === "/dashboard/settings"
														? "bg-primary text-primary-foreground shadow-sm"
														: "text-muted-foreground hover:bg-primary/10 hover:text-primary"
												)}
												onClick={toggleSheet}
											>
												<UserCircle className="mr-3 h-5 w-5" />
												Profile
											</Link>
										</motion.div>
										<motion.div variants={navItemVariants}>
											<Button
												variant="ghost"
												className="w-full justify-start flex items-center px-3 py-2.5 text-base font-medium rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
												onClick={handleLogout}
											>
												<LogOut className="mr-3 h-5 w-5" />
												Logout
											</Button>
										</motion.div>
									</>
								) : (
									<>
										<motion.div variants={navItemVariants}>
											<Link
												href="/login"
												className={cn(
													"flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-all duration-150 ease-in-out",
													pathname === "/login"
														? "bg-primary text-primary-foreground shadow-sm"
														: "text-muted-foreground hover:bg-primary/10 hover:text-primary"
												)}
												onClick={toggleSheet}
											>
												<LogIn className="mr-3 h-5 w-5" />
												Login
											</Link>
										</motion.div>
										<motion.div variants={navItemVariants}>
											<Link
												href="/register"
												className={cn(
													"flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-all duration-150 ease-in-out",
													pathname === "/register"
														? "bg-primary text-primary-foreground shadow-sm"
														: "text-muted-foreground hover:bg-primary/10 hover:text-primary"
												)}
												onClick={toggleSheet}
											>
												<UserPlus className="mr-3 h-5 w-5" />
												Sign Up
											</Link>
										</motion.div>
									</>
								)}
							</motion.nav>

							{/* Removed the old motion.div for login/signup buttons as they are now part of the nav list */}
						</motion.div>
					</SheetContent>
				)}
			</AnimatePresence>
		</Sheet>
	);
}
