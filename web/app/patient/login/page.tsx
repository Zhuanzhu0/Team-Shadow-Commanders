"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PatientLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock validation
        // In a real app, this would hit an API
        if (email && password) {
            setTimeout(() => {
                setIsLoading(false);
                toast.success("Welcome back, James!", {
                    description: "Syncing your health data..."
                });
                // For demo purposes, we assume p1 is logging in
                router.push("/patient/dashboard");
            }, 1000);
        } else {
            setIsLoading(false);
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 justify-center mb-4">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">PulseGuard</span>
                    </div>
                    <CardTitle className="text-2xl text-center">Patient Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to access your health dashboard
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="james.wilson@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                        <div className="text-center text-sm text-slate-500">
                            <Link href="#" className="hover:text-blue-600 underline underline-offset-4">
                                Forgot your password?
                            </Link>
                            <div className="mt-2 text-xs">
                                For demo, use any email/password.
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
