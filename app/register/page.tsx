"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const { register } = useAuth();

  const [step, setStep] = React.useState<"details" | "otp">("details");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("+971 50 889 1234");
  const [password, setPassword] = React.useState("");

  // OTP state
  const [generatedOtp, setGeneratedOtp] = React.useState("736523");
  const [enteredOtp, setEnteredOtp] = React.useState("");
  const [otpTimer, setOtpTimer] = React.useState(45);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = React.useState(false);

  // Timer countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleInitiateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp(code); // Pre-filled for effortless one-click verification
    setOtpTimer(45);
    setStep("otp");
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setError("Invalid OTP code. Please enter the 6-digit code shown above.");
      return;
    }

    setIsLoading(true);
    setOtpSuccess(true);

    try {
      const result = await register({
        name,
        email,
        phone,
        password,
      });

      if (!result.success) {
        setError(result.error || "Registration failed");
        setIsLoading(false);
        setOtpSuccess(false);
        return;
      }

      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/account");
        }
      }, 600);
    } catch {
      setError("An unexpected error occurred during account creation");
      setIsLoading(false);
      setOtpSuccess(false);
    }
  };

  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp(code);
    setOtpTimer(45);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
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
            {step === "details" ? "Create Customer Account" : "Confirm Mobile Number"}
          </h1>
          <p className="text-xs text-[#68706b]">
            {step === "details"
              ? "Order genuine OEM spare parts with saved addresses and priority dispatch."
              : `We sent a one-time verification code to ${phone}.`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              step === "details"
                ? "bg-[#16834b] text-white border-[#16834b]"
                : "bg-white/80 text-[#16834b] border-[#16834b]/30"
            }`}
          >
            <span>1</span>
            <span>Account Details</span>
          </div>
          <div className="w-6 h-px bg-[rgba(17,20,18,0.15)]" />
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              step === "otp"
                ? "bg-[#16834b] text-white border-[#16834b]"
                : "bg-white/80 text-[#68706b] border-[rgba(17,20,18,0.12)]"
            }`}
          >
            <span>2</span>
            <span>Mobile OTP</span>
          </div>
        </div>

        {/* Main Card with Prominent Glassmorphism */}
        <div className="rounded-3xl glass-card border border-white/90 p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-xs text-rose-700 backdrop-blur-md">
              {error}
            </div>
          )}

          {step === "details" ? (
            <form onSubmit={handleInitiateOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Full Name *
                </label>
                <Input
                  icon={<User className="w-4 h-4" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rashid Al-Nuaimi"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.ae"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Mobile Number (for SMS & WhatsApp Dispatch) *
                </label>
                <Input
                  icon={<Phone className="w-4 h-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  required
                />
                <p className="text-[11px] text-[#68706b] mt-1">
                  A 6-digit confirmation code will be sent to this number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Password *
                </label>
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
                className="w-full font-bold gap-2 mt-2 shadow-lg shadow-[#16834b]/20"
              >
                <span>Verify Mobile & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              {/* Simulated SMS notification bubble */}
              <div className="p-3.5 rounded-2xl bg-[#e8f5ee]/90 border border-[#16834b]/20 text-xs text-[#0d6338] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Smartphone className="w-4 h-4 text-[#16834b]" />
                  <span>SMS Verification Sent</span>
                </div>
                <p className="text-[11px] text-[#111412]/80">
                  Verification Code: <strong className="font-mono text-sm tracking-wider text-[#16834b]">{generatedOtp}</strong>
                </p>
                <p className="text-[10px] text-[#68706b]">
                  (Pre-filled automatically for seamless verification testing)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-2 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="------"
                  className="w-full h-14 text-center font-mono text-2xl tracking-[0.4em] font-extrabold rounded-2xl border-2 border-[rgba(17,20,18,0.12)] bg-white/90 text-[#111412] focus:border-[#16834b] focus:ring-4 focus:ring-[#16834b]/15 focus:outline-none transition-all shadow-inner"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#68706b]">
                <span>
                  Code expires in: <strong className="text-[#111412]">{otpTimer}s</strong>
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpTimer > 30}
                  className="text-[#16834b] hover:underline font-semibold disabled:opacity-40 disabled:no-underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold gap-2 shadow-lg shadow-[#16834b]/20"
              >
                {otpSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mobile Verified! Activating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm OTP & Create Account</span>
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full text-center text-xs text-[#68706b] hover:text-[#111412] transition-colors"
              >
                ← Back to Edit Account Details
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[rgba(17,20,18,0.06)] text-center text-xs text-[#68706b]">
            Already have an account?{" "}
            <Link
              href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="font-bold text-[#16834b] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs text-[#68706b]">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
