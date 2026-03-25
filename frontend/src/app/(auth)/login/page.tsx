"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      // Error is caught and set in the store
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 items-center pb-8 border-b border-slate-100 mb-6 relative mt-6">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 absolute -top-12 shadow-md border-4 border-white">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center mt-2">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your MagicCard account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-md"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-md"
              />
            </div>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
            <Button type="submit" className="w-full h-12 text-lg mt-6 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-slate-100 mt-6 bg-slate-50/50 rounded-b-xl">
          <div className="text-sm text-center text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
