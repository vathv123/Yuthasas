"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: "Weak", color: "text-red-600", width: "w-1/3" };
  if (score <= 4) return { label: "Medium", color: "text-amber-600", width: "w-2/3" };
  return { label: "Strong", color: "text-emerald-600", width: "w-full" };
};

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const head = local.slice(0, 2);
  const tail = local.length > 4 ? local.slice(-1) : "";
  return `${head}${"*".repeat(Math.max(local.length - 3, 2))}${tail}@${domain}`;
};

const Signup = () => {
  const router = useRouter();
  const { status } = useSession();
  const [betaFull, setBetaFull] = useState(false);
  const [betaCount, setBetaCount] = useState<number | null>(null);
  const [betaLimit, setBetaLimit] = useState<number | null>(null);
  const [promoActive, setPromoActive] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [formError, setFormError] = useState("");
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  const [selectedDeleteEmail, setSelectedDeleteEmail] = useState("");
  const [deleteOtpSent, setDeleteOtpSent] = useState(false);
  const [deleteOtpCode, setDeleteOtpCode] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isSendingDeleteOtp, setIsSendingDeleteOtp] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const passwordStrength = getPasswordStrength(password);
  const isStrongPassword = passwordStrength.label === "Strong";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/Enterprise");
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("limit") === "1") {
      setFormError("This device already has 2 accounts. Remove one account to continue.");
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/beta-status");
        const data = await res.json();
        if (ignore) return;
        setPromoActive(Boolean(data?.active));
        setBetaFull(Boolean(data?.full));
        setBetaCount(typeof data?.count === "number" ? data.count : null);
        setBetaLimit(typeof data?.limit === "number" ? data.limit : null);
      } catch {}
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleGoogleSignIn = useCallback(() => {
    const callbackUrl = `${window.location.origin}/Enterprise`;
    if (promoActive && betaFull) return;
    const run = async () => {
      const res = await fetch("/api/auth/register/device-limit", { method: "GET" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.blocked) {
        const accounts = Array.isArray(data?.accounts) ? data.accounts : [];
        setLinkedAccounts(accounts);
        setSelectedDeleteEmail(accounts[0] ?? "");
        setFormError("This device already has 2 accounts. Remove one account to continue.");
        return;
      }
      signIn("google", { callbackUrl, redirect: true });
    };
    run().catch(() => {
      setFormError("Unable to continue sign in. Please try again.");
    });
  }, [promoActive, betaFull]);

  const sendOtp = async () => {
    if (!name || !email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (name.trim().length < 3) {
      setFormError("Username must be at least 3 characters.");
      return;
    }
    if (!isStrongPassword) {
      setFormError("Password must be strong before continuing.");
      return;
    }

    setFormError("");
    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.code === "ACCOUNT_LIMIT_EXCEEDED" && Array.isArray(data?.accounts)) {
          setLinkedAccounts(data.accounts);
          setSelectedDeleteEmail(data.accounts[0] ?? "");
        }
        setFormError(data?.error ?? "Unable to send OTP.");
        return;
      }
      setLinkedAccounts([]);
      setDeleteError("");
      setOtpSent(true);
    } catch {
      setFormError("Unable to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const requestDeleteOtp = async () => {
    if (!selectedDeleteEmail) return;
    setDeleteError("");
    setIsSendingDeleteOtp(true);
    try {
      const res = await fetch("/api/auth/accounts/request-delete-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedDeleteEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data?.error ?? "Unable to send delete OTP.");
        return;
      }
      setDeleteOtpSent(true);
    } catch {
      setDeleteError("Unable to send delete OTP.");
    } finally {
      setIsSendingDeleteOtp(false);
    }
  };

  const confirmDeleteAccount = async () => {
    if (!selectedDeleteEmail || !/^\d{6}$/.test(deleteOtpCode)) {
      setDeleteError("Enter a valid 6-digit OTP code.");
      return;
    }
    setDeleteError("");
    setIsConfirmingDelete(true);
    try {
      const res = await fetch("/api/auth/accounts/confirm-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedDeleteEmail, code: deleteOtpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data?.error ?? "Unable to delete account.");
        return;
      }
      setLinkedAccounts((prev) => prev.filter((e) => e !== selectedDeleteEmail));
      setSelectedDeleteEmail("");
      setDeleteOtpCode("");
      setDeleteOtpSent(false);
      setDeleteError("");
      setFormError("Account removed. You can continue signup now.");
    } catch {
      setDeleteError("Unable to delete account.");
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  const verifyOtpAndSignup = async () => {
    if (!otpCode.trim()) {
      setFormError("Enter OTP code.");
      return;
    }

    setFormError("");
    setIsVerifyingOtp(true);
    try {
      const verifyRes = await fetch("/api/auth/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setFormError(verifyData?.error ?? "Invalid OTP.");
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl: "/Enterprise",
      });

      if (result?.error || !result?.ok) {
        setFormError("OTP verified, but sign in failed. Please sign in using your email/password.");
        return;
      }

      // Use full-page navigation after credential callback to avoid client-side session races.
      const target = result.url || "/Enterprise";
      window.location.assign(target);
    } catch {
      setFormError("Unable to verify OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen font-[Gilroy-Medium] gap-6">
      {promoActive && betaFull && (
        <div className="w-[350px] bg-black text-white rounded-2xl px-4 py-3 text-center text-sm">
          Premium beta is full. Limit reached{betaLimit ? ` (${betaLimit})` : ""}. Please wait for the next release.
        </div>
      )}
      {promoActive && !betaFull && betaLimit !== null && betaCount !== null && (
        <div className="w-[350px] bg-white border border-black/10 rounded-2xl px-4 py-3 text-center text-sm text-black/70">
          Premium beta access: {betaCount}/{betaLimit} slots filled
        </div>
      )}
      <div className="flex flex-col gap-2 items-center">
        <p className="text-2xl">Create your account</p>
        <p className="text-[#bcbcbc] text-[15px]">Let's get start with your business with Yuthasas.</p>
      </div>
      <button
        onClick={handleGoogleSignIn}
        type="button"
        disabled={promoActive && betaFull}
        className={`w-[350px] h-[48px] flex justify-center items-center gap-3 border border-black rounded-2xl ${promoActive && betaFull ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <img src="/image/Google.png" alt="Google" className="w-[26px] h-[26px] block" />
        <span className="text-[15px] leading-tight">Signin with Google</span>
      </button>
      <div className="flex flex-col gap-2">
        <div className="w-[350px] flex gap-3 items-center">
          <div className="w-1/2 h-[0.7px] bg-[#d0cccc]"></div>
          <span>Or</span>
          <div className="w-1/2 h-[0.7px] bg-[#d0cccc]"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col w-[350px] gap-1">
            <label htmlFor="username">Name</label>
            <input
              className="w-full rounded-2xl border border-[#d0cccc] h-[45px] text-[15px] flex items-center pl-3 focus:outline-0"
              type="text"
              placeholder="Enter your name"
              minLength={3}
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-[350px] gap-1">
            <label htmlFor="username">Email</label>
            <input
              className="w-full rounded-2xl border border-[#d0cccc] h-[45px] text-[15px] flex items-center pl-3 focus:outline-0"
              type="email"
              placeholder="Enter your email"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-[350px] gap-1">
            <label htmlFor="username">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-2xl border border-[#d0cccc] h-[45px] text-[15px] flex items-center pl-3 pr-12 focus:outline-0"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                minLength={10}
                maxLength={20}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/55 hover:text-black"
                aria-label={showPassword ? "Lock password" : "Unlock password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V8a5 5 0 0 1 9.9-1" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-1">
              <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.width} ${
                    passwordStrength.label === "Strong"
                      ? "bg-emerald-500"
                      : passwordStrength.label === "Medium"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
              <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                Password strength: {passwordStrength.label}
              </p>
            </div>
          </div>
          {otpSent && (
            <div className="flex flex-col w-[350px] gap-1">
              <label htmlFor="otp">OTP Code</label>
              <input
                id="otp"
                className="w-full rounded-2xl border border-[#d0cccc] h-[45px] text-[15px] flex items-center pl-3 focus:outline-0"
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>
          )}
        </div>
      </div>
      {formError && <div className="w-[350px] text-sm text-red-600 text-center">{formError}</div>}
      {linkedAccounts.length > 0 && (
        <div className="w-[350px] rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Device limit reached: 2 accounts per device. Remove one account to continue.
          {selectedDeleteEmail ? (
            <p className="mt-1 text-red-600">
              Selected account: <span className="font-medium">{maskEmail(selectedDeleteEmail)}</span>
            </p>
          ) : null}
        </div>
      )}
      {linkedAccounts.length > 0 && (
        <div className="w-[350px] rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
          <p className="text-red-700">
            This device already has 2 accounts. Remove one account to continue.
          </p>
          <div className="mt-3">
            <label className="block text-black/70 mb-1">Select account to remove</label>
            <select
              value={selectedDeleteEmail}
              onChange={(e) => setSelectedDeleteEmail(e.target.value)}
              className="w-full rounded-lg border border-red-200 bg-white h-10 px-2"
            >
              {linkedAccounts.map((acc) => (
                <option key={acc} value={acc}>
                  {maskEmail(acc)}
                </option>
              ))}
            </select>
          </div>
          {deleteOtpSent && (
            <div className="mt-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={deleteOtpCode}
                onChange={(e) => setDeleteOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-lg border border-red-200 bg-white h-10 px-2"
                placeholder="Enter delete OTP"
              />
            </div>
          )}
          {deleteError && <p className="mt-2 text-red-600">{deleteError}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={requestDeleteOtp}
              disabled={!selectedDeleteEmail || isSendingDeleteOtp}
              className="flex-1 rounded-lg border border-black h-10 disabled:opacity-50"
            >
              {isSendingDeleteOtp ? "Sending..." : "Send Delete OTP"}
            </button>
            <button
              type="button"
              onClick={confirmDeleteAccount}
              disabled={!deleteOtpSent || isConfirmingDelete}
              className="flex-1 rounded-lg bg-black text-white h-10 disabled:opacity-50"
            >
              {isConfirmingDelete ? "Removing..." : "Remove Account"}
            </button>
          </div>
        </div>
      )}
      <div className="w-[350px] flex flex-col gap-2">
        <label className="flex items-center text-[15px] gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I agree to all Terms, Privacy Policy, and Fees.
        </label>
      </div>
      <div className="w-[350px]">
        {!otpSent ? (
          <button
            onClick={sendOtp}
            className={`w-full rounded-2xl bg-black flex justify-center items-center h-[40px] text-[15px] text-white ${(promoActive && betaFull) || isSendingOtp ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            type="button"
            disabled={(promoActive && betaFull) || isSendingOtp || !isStrongPassword}
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={verifyOtpAndSignup}
              className={`flex-1 rounded-2xl bg-black flex justify-center items-center h-[40px] text-[15px] text-white ${isVerifyingOtp ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              type="button"
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify & Sign Up"}
            </button>
            <button
              onClick={sendOtp}
              className={`flex-1 rounded-2xl border border-black flex justify-center items-center h-[40px] text-[15px] text-black ${isSendingOtp ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              type="button"
              disabled={isSendingOtp}
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
      <div className="w-[350px] flex">
        <p className="text-[15px] text-black/60">Already have an account? Use the sign-in options above.</p>
      </div>
    </div>
  );
};

export default Signup;
