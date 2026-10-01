"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Layers, Lock, Mail, ArrowRight, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const { login } = useAuth();

  const [email, setEmail] = React.useState("customer@apexauto.ae");
  const [password, setPassword] = React.useState("Customer@123");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(email, password);

      if (!result.success || !result.user) {
        setError(result.error || "Login failed");
        setIsLoading(false);
        return;
      }

      const user = result.user;

      // Smart redirection based on role and query param
      if (user.role === "admin" || user.role === "staff") {
        router.push("/admin");
      } else if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/account");
      }
    } catch {
      setError("An unexpected error occurred. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const setAdminDemo = () => {
    setEmail("admin@apexautospares.com");
    setPassword("Admin@12345");
  };

  const setCustomerDemo = () => {
    setEmail("customer@apexauto.ae");
    setPassword("Customer@123");
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#111412] flex items-center justify-center text-white shadow-sm border border-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111412]">
              ApexAuto
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111412]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#68706b]">
            Sign in to track orders, manage spare parts, or access the workshop console.
          </p>
        </div>

        {/* Login Card with Prominent Glassmorphism */}
        <div className="rounded-3xl glass-card border border-white/90 p-6 sm:p-8 shadow-xl space-y-5">
          {/* Quick preset selector for evaluation */}
          <div className="p-1 rounded-xl bg-white/70 border border-white/80 grid grid-cols-2 gap-1 text-xs font-semibold backdrop-blur-md">
            <button
              type="button"
              onClick={setCustomerDemo}
              className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                email.includes("customer")
                  ? "bg-white text-[#111412] shadow-2xs font-bold"
                  : "text-[#68706b] hover:text-[#111412]"
              }`}
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={setAdminDemo}
              className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                email.includes("admin")
                  ? "bg-white text-[#16834b] shadow-2xs font-bold"
                  : "text-[#68706b] hover:text-[#111412]"
              }`}
            >
              Workshop Admin
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-xs text-rose-700 backdrop-blur-md">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Email Address
              </label>
              <Input
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#111412]">
                  Password
                </label>
                <span className="text-[10px] text-[#68706b]">Demo active</span>
              </div>
              <Input
                type="password"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold gap-2 mt-2 shadow-lg shadow-[#16834b]/20"
            >
              <span>Authenticate & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Registration link */}
          <div className="pt-4 border-t border-[rgba(17,20,18,0.06)] text-center text-xs text-[#68706b]">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="font-bold text-[#16834b] hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-[#68706b]">
          <Link href="/" className="hover:text-[#111412] transition-colors">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs text-[#68706b]">Loading portal login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
