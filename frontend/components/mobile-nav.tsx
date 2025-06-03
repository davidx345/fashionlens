"use client";

import * as React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MountainIcon, LogOut, UserCircle, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import { logoutUser as apiLogoutUser } from "@/app/api/services/auth-service";

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

	// Auto-close mobile nav when route changes
	React.useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	const handleLogout = async () => {
		await apiLogoutUser();
		logout();
		setIsOpen(false);
		router.push("/login");
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{/* Mobile Header Bar */}
			<div className="md:hidden flex items-center justify-between w-full px-3 py-2 text-foreground bg-background">
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
			</div>			<SheetContent
				side="left"
				className="w-full max-w-[300px] sm:max-w-[320px] p-0 bg-background border-r-0 shadow-2xl shadow-primary/30 transition-all duration-300 ease-in-out"
			>
				<VisuallyHidden>
					<SheetTitle>Mobile Navigation Menu</SheetTitle>
				</VisuallyHidden>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-start p-5 border-b border-border/80">
						<Link
							href="/"
							className="flex items-center gap-2.5"
							onClick={toggleSheet}
						>
							<MountainIcon className="h-7 w-7 text-primary" />
							<span className="text-xl font-bold text-foreground">
								FashionLens
							</span>
						</Link>
					</div>

					<nav className="flex-grow px-3 py-5 space-y-1.5 overflow-y-auto">
						{currentNavItems.map(
							(item) =>
								!item.disabled &&
								item.href && (
									<div key={item.href} className="opacity-100 transform translate-y-0 transition-all duration-200 ease-in-out">
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
											{item.icon && <span className="mr-3">{item.icon}</span>}
											{item.title}
										</Link>
									</div>
								)
						)}
						
						{/* Conditional Logout/Profile or Login/Signup links */}
						{isAuthenticated && user ? (
							<>
								<div className="opacity-100 transform translate-y-0 transition-all duration-200 ease-in-out">
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
								</div>
								<div className="opacity-100 transform translate-y-0 transition-all duration-200 ease-in-out">
									<Button
										variant="ghost"
										className="w-full justify-start flex items-center px-3 py-2.5 text-base font-medium rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
										onClick={handleLogout}
									>
										<LogOut className="mr-3 h-5 w-5" />
										Logout
									</Button>
								</div>
							</>
						) : (
							<>
								<div className="opacity-100 transform translate-y-0 transition-all duration-200 ease-in-out">
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
								</div>
								<div className="opacity-100 transform translate-y-0 transition-all duration-200 ease-in-out">
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
								</div>
							</>
						)}
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	);
}
