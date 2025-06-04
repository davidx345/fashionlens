// filepath: c:/Users/xstat/OneDrive/Documents/Dev/webDev/fashionlens/frontend/app/forgot-password/page.tsx
"use client";

import React, { useState } from "react";
// import Link from "next/link"; // Not strictly needed for this version
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Added CardFooter import
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mail, KeyRound, ArrowLeft } from "lucide-react"; // Corrected Icon import
// import { requestPasswordReset } from "@/app/api/services/auth-service"; // Placeholder for API service

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // Renamed from setEmailSent to isSuccess for clarity

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async () => {
    setIsLoading(true);
    setApiError(null);
    setIsSuccess(false);
    try {
      // console.log("Requesting password reset for:", data.email);
      // await requestPasswordReset(data.email); // Call the actual API service
      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message ||
        "Failed to send password reset email. Please try again.";
      setApiError(errorMessage);
      console.error("Forgot password API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-slate-900 p-4">
      <Card className="w-full max-w-md bg-card shadow-2xl border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Forgot Your Password?
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            No worries! Enter your email address below and we&apos;ll send you a link
            to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {isSuccess ? (
            <div className="rounded-md border border-green-500/50 bg-green-500/10 p-4 text-center">
              <p className="text-sm text-green-700 dark:text-green-400">
                If an account with that email exists, a password reset link has
                been sent. Please check your inbox (and spam folder).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-muted-foreground"
                >
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
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-input"
                    }`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive pt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {apiError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center">
                  <p className="text-sm text-destructive">{apiError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-semibold"
                disabled={isLoading}
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
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-center pt-4 pb-8"> {/* Added CardFooter */}
          <Button
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {/* Corrected Icon usage */}
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
