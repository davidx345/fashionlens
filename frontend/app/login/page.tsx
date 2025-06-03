"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/src/components/ui/input"; // Corrected path
import { Label } from "@/src/components/ui/label"; // Corrected path
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, LogIn, Mail, LockKeyhole, UserPlus, Chrome, Apple, ArrowLeft } from "lucide-react";
import useStore from "@/store/useStore";
import { loginUser } from "@/app/api/services/auth-service"; // Import the actual API service
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }), // Adjusted for simplicity, real app: .min(8, { message: "Password must be at least 8 characters" })
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setAuthenticated, isAuthenticated } = useStore(); // Get actions and isAuthenticated from store

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      console.log("Login attempt with API:", data);
      const user = await loginUser(data.email, data.password);
      setUser(user); // user object from API response
      setAuthenticated(true);
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setApiError(errorMessage);
      console.error("Login API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const result = await signIn("google", { redirect: false, callbackUrl: "/dashboard" });
      if (result?.error) {
        setApiError(result.error);
        setIsLoading(false);
      } else if (result?.url) {
        // NextAuth.js handles session; useEffect will redirect.
      }
    } catch (error: any) {
      setApiError(error.message || "An unexpected error occurred during Google sign-in.");
      setIsLoading(false);
    }
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-slate-900 p-4">      <Card className="w-full max-w-md bg-card shadow-2xl border-border/50">
        <CardHeader className="text-center relative">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
            disabled={isLoading}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Sign in to access your personalized fashion insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`pl-10 h-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive pt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</Label>
                <Link href="/forgot-password" passHref legacyBehavior>
                  <a className={`text-xs text-primary hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                    Forgot Password?
                  </a>
                </Link>
              </div>
              <div className="relative flex items-center">
                <LockKeyhole className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-10 h-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                  disabled={isLoading}
                  autoComplete="current-password"
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
              {errors.password && <p className="text-xs text-destructive pt-1">{errors.password.message}</p>}
            </div>

            {apiError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center">
                <p className="text-sm text-destructive">{apiError}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : "Sign In"}
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or continue with</span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          <div className="space-y-3">            <Button 
              variant="outline" 
              className="w-full h-10 border-border/70 hover:bg-muted/50" 
              disabled={isLoading}
              onClick={() => alert("Coming soon!")}
            >
              <Chrome className="mr-2 h-5 w-5" /> Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10 border-border/70 hover:bg-muted/50" 
              disabled={isLoading}
              onClick={() => alert("Coming soon!")}
            >
              <Apple className="mr-2 h-5 w-5" /> Continue with Apple
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-center justify-center pt-6 pb-8">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/register" passHref legacyBehavior>
              <a className={`font-medium text-primary hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                Sign Up Now
              </a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
