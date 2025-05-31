"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, UserPlus, Mail, LockKeyhole, CheckCircle, XCircle, Chrome, Apple, User } from "lucide-react";
import useStore from "@/store/useStore";
import { registerUser, ApiUser } from "@/app/api/services/auth-service";

const passwordValidationCriteria = [
	{ regex: /.{8,}/, label: "At least 8 characters" },
	{ regex: /[a-z]/, label: "At least one lowercase letter" },
	{ regex: /[A-Z]/, label: "At least one uppercase letter" },
	{ regex: /[0-9]/, label: "At least one number" },
	{ regex: /[^a-zA-Z0-9]/, label: "At least one special character" },
];

const passwordSchema = z
	.string()
	.refine((pass) => passwordValidationCriteria.every((criterion) => criterion.regex.test(pass)), {
		message: "Password does not meet all criteria.", // Generic message, specific criteria shown in UI
	});

const signupSchema = z
	.object({
		name: z.string().min(2, { message: "Name must be at least 2 characters" }),
		email: z.string().email({ message: "Invalid email address" }),
		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	}); // path of error

type SignupFormInputs = z.infer<typeof signupSchema>;

export default function SignupPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [currentPasswordCriteria, setCurrentPasswordCriteria] = useState(
		passwordValidationCriteria.map((c) => ({ ...c, met: false }))
	);
	const { setUser, setAuthenticated, isAuthenticated } = useStore(); // Get isAuthenticated

	useEffect(() => {
		if (isAuthenticated) {
		  router.replace("/dashboard");
		}
	}, [isAuthenticated, router]);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignupFormInputs>({
		resolver: zodResolver(signupSchema),
		mode: "onBlur", // Validate on blur for better UX
	});

	const watchedPassword = watch("password");

	React.useEffect(() => {
		if (watchedPassword) {
			let strength = 0;
			const updatedCriteria = passwordValidationCriteria.map((criterion) => {
				const met = criterion.regex.test(watchedPassword);
				if (met) strength += 100 / passwordValidationCriteria.length;
				return { ...criterion, met };
			});
			setPasswordStrength(Math.min(strength, 100)); // Cap at 100
			setCurrentPasswordCriteria(updatedCriteria);
		} else {
			setPasswordStrength(0);
			setCurrentPasswordCriteria(passwordValidationCriteria.map((c) => ({ ...c, met: false })));
		}
	}, [watchedPassword]);

	const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
		setIsLoading(true);
		setApiError(null);
		console.log("Signup attempt:", { name: data.name, email: data.email });

		try {
			// Call registerUser with name, email and password
			const registeredUserData: ApiUser = await registerUser(data.name, data.email, data.password);
			console.log("Registration successful:", registeredUserData);

			// Set user and authentication state in Zustand store
			// The backend's registerUser service now returns the ApiUser object directly
			setUser(registeredUserData);
			setAuthenticated(true);
			router.push("/dashboard"); // Redirect to dashboard
		} catch (error: any) {
			console.error("Registration failed:", error);
			setApiError(error.message || "An unexpected error occurred during registration.");
		} finally {
			setIsLoading(false);
		}
	};

	const getStrengthColor = () => {
		if (passwordStrength < 40) return "bg-destructive";
		if (passwordStrength < 80) return "bg-yellow-500";
		return "bg-green-500";
	};

	if (isAuthenticated) {
		// Render null or a loading indicator while redirecting
		return (
		  <div className="flex min-h-screen items-center justify-center bg-background">
			<p>Loading...</p>
		  </div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-slate-900 p-4 py-8 md:py-12">
			<Card className="w-full max-w-lg bg-card shadow-2xl border-border/50">
				<CardHeader className="text-center">
					<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
						<UserPlus className="h-8 w-8 text-primary" />
					</div>
					<CardTitle className="text-3xl font-bold text-foreground">Create Your Account</CardTitle>
					<CardDescription className="text-muted-foreground pt-1">
						Join FashionLens and start your style revolution today.
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-2">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div className="space-y-1.5">
							<Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
								Full Name
							</Label>
							<div className="relative flex items-center">
								<User className="absolute left-3 h-5 w-5 text-muted-foreground" />
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									{...register("name")}
									className={`pl-10 h-10 ${
										errors.name ? "border-destructive focus-visible:ring-destructive" : "border-input"
									}`}
									disabled={isLoading}
									autoComplete="name"
								/>
							</div>
							{errors.name && <p className="text-xs text-destructive pt-1">{errors.name.message}</p>}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
								Email Address
							</Label>
							<div className="relative flex items-center">
								<Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									{...register("email")}
									className={`pl-10 h-10 ${
										errors.email ? "border-destructive focus-visible:ring-destructive" : "border-input"
									}`}
									disabled={isLoading}
									autoComplete="email"
								/>
							</div>
							{errors.email && <p className="text-xs text-destructive pt-1">{errors.email.message}</p>}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
								Password
							</Label>
							<div className="relative flex items-center">
								<LockKeyhole className="absolute left-3 h-5 w-5 text-muted-foreground" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									{...register("password")}
									className={`pl-10 h-10 ${
										errors.password ? "border-destructive focus-visible:ring-destructive" : "border-input"
									}`}
									disabled={isLoading}
									autoComplete="new-password"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() => setShowPassword(!showPassword)}
									disabled={isLoading}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</Button>
							</div>
							{watchedPassword && (
								<div className="pt-2 space-y-2">
									<Progress value={passwordStrength} className={`h-1.5 ${getStrengthColor()}`} />
									<ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs">
										{currentPasswordCriteria.map((criterion) => (
											<li
												key={criterion.label}
												className={`flex items-center ${
													criterion.met ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
												}`}
											>
												{criterion.met ? (
													<CheckCircle className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
												) : (
													<XCircle className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
												)}
												{criterion.label}
											</li>
										))}
									</ul>
								</div>
							)}
							{errors.password && <p className="text-xs text-destructive pt-1">{errors.password.message}</p>}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">
								Confirm Password
							</Label>
							<div className="relative flex items-center">
								<LockKeyhole className="absolute left-3 h-5 w-5 text-muted-foreground" />
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="••••••••"
									{...register("confirmPassword")}
									className={`pl-10 h-10 ${
										errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : "border-input"
									}`}
									disabled={isLoading}
									autoComplete="new-password"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									disabled={isLoading}
									aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
								>
									{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</Button>
							</div>
							{errors.confirmPassword && <p className="text-xs text-destructive pt-1">{errors.confirmPassword.message}</p>}
						</div>

						{apiError && (
							<div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center">
								<p className="text-sm text-destructive">{apiError}</p>
							</div>
						)}

						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-semibold"
							disabled={isLoading || (watchedPassword && passwordStrength < 100)}
						>
							{isLoading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Creating Account...
								</>
							) : (
								"Create Account"
							)}
						</Button>
					</form>

					<div className="my-6 flex items-center">
						<div className="flex-grow border-t border-border/50"></div>
						<span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or sign up with</span>
						<div className="flex-grow border-t border-border/50"></div>
					</div>

					<div className="space-y-3">
						<Button
							variant="outline"
							className="w-full h-10 border-border/70 hover:bg-muted/50"
							disabled={isLoading}
						>
							<Chrome className="mr-2 h-5 w-5" /> Continue with Google
						</Button>
						<Button
							variant="outline"
							className="w-full h-10 border-border/70 hover:bg-muted/50"
							disabled={isLoading}
						>
							<Apple className="mr-2 h-5 w-5" /> Continue with Apple
						</Button>
					</div>
				</CardContent>
				<CardFooter className="flex-col items-center justify-center pt-6 pb-8">
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" passHref legacyBehavior>
							<a
								className={`font-medium text-primary hover:underline ${
									isLoading ? "pointer-events-none opacity-50" : ""
								}`}
							>
								Sign In
							</a>
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
