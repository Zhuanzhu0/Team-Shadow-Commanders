"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
    role: "doctor" | "nurse" | "patient";
    type: "login" | "signup";
}

export function AuthForm({ role, type }: AuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;

        try {
            if (type === "login") {
                // Import the auth functions at the top of the file
                const { signInWithProfile } = await import("@/lib/auth");

                // Sign in with profile verification
                const { profile, error: authError } = await signInWithProfile(email, password);

                if (authError) {
                    setError(authError.message);
                    return;
                }

                if (!profile) {
                    setError("Authentication failed. Please try again.");
                    return;
                }

                // Redirect based on role
                const redirectMap = {
                    doctor: "/doctor/dashboard",
                    nurse: "/nurse/dashboard",
                    patient: "/patient/dashboard",
                };

                const redirectTo = redirectMap[profile.role] || "/";
                router.push(redirectTo);
            } else {
                // Signup flow
                const { signUpUser } = await import("@/lib/auth");

                const { user, error: authError } = await signUpUser(
                    email,
                    password,
                    fullName,
                    role
                );

                if (authError) {
                    setError(authError.message);
                    return;
                }

                if (!user) {
                    setError("Signup failed. Please try again.");
                    return;
                }

                // Show success message or redirect
                // For now, redirect to login page
                router.push(`/${role}/login`);
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const roleLabels = {
        doctor: "Doctor",
        nurse: "Nurse",
        patient: "Patient",
    };

    const roleColors = {
        doctor: "text-blue-600",
        nurse: "text-teal-600",
        patient: "text-indigo-600",
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 ring-1 ring-slate-200">
            <CardHeader className="space-y-1">
                <Link
                    href="/"
                    className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
                <CardTitle className="text-2xl font-bold">
                    {type === "login" ? "Welcome back" : "Create an account"}
                </CardTitle>
                <CardDescription>
                    {type === "login" ? "Sign in to your" : "Register as a"}{" "}
                    <span className={`font-semibold ${roleColors[role]}`}>
                        {roleLabels[role]}
                    </span>{" "}
                    account
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    {type === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="John Doe"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 font-medium">{error}</div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {type === "login" ? "Sign In" : "Create Account"}
                    </Button>
                    <div className="text-sm text-center text-slate-500">
                        {type === "login" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <Link
                                    href={`/${role}/signup`}
                                    className="text-slate-900 font-medium hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link
                                    href={`/${role}/login`}
                                    className="text-slate-900 font-medium hover:underline"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
