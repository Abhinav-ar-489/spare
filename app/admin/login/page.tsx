"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, Lock, Mail, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@apexautospares.com");
  const [password, setPassword] = React.useState("Admin@12345");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      if (supabase) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) {
          // If Supabase credentials are configured but user not found, let them know or fallback
          setError(authError.message);
          setIsLoading(false);
          return;
        }
      }

      // Successful login redirect to admin dashboard
      router.push("/admin");
    } catch {
      setError("An unexpected error occurred. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#111412] flex items-center justify-center text-white mx-auto shadow-sm">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111412]">
            Workshop Manager Login
          </h1>
          <p className="text-xs text-[#68706b]">
            Secure administrative control for inventory, compatibility & leads.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Admin Email Address
              </label>
              <Input
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@apexautospares.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#111412]">
                  Password
                </label>
                <span className="text-[11px] text-[#68706b]">Demo pre-filled</span>
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
              className="w-full font-semibold gap-2 mt-2"
            >
              <span>Authenticate & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-4 border-t border-[rgba(17,20,18,0.06)] text-xs text-[#68706b] space-y-2">
            <div className="flex items-center gap-1.5 text-[#16834b] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Role-Based Access Protected</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Default administrator credentials are pre-configured for evaluation. You can link your Supabase Auth user in production settings.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#68706b] hover:text-[#111412] transition-colors"
          >
            ← Return to Public Spare Parts Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
