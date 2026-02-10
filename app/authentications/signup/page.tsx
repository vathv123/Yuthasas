"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
const openCenteredPopup = (url: string, title = "Sign in", w = 600, h = 700) => {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

  const left = dualScreenLeft + (width - w) / 2;
  const top = dualScreenTop + (height - h) / 2;

  const features = `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`;
  return window.open(url, title, features);
};
const Signup = () => {
  const router = useRouter();
  const { status } = useSession();
  const [betaFull, setBetaFull] = useState(false);
  const [betaCount, setBetaCount] = useState<number | null>(null);
  const [betaLimit, setBetaLimit] = useState<number | null>(null);
  const [promoActive, setPromoActive] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/Enterprise");
    }
  }, [status, router]);

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
    
    if (!agreed) {
      setAgreeError(true);
      return;
    }
    if (promoActive && betaFull) return;
    signIn("google", { callbackUrl, redirect: true });
  }, [agreed, promoActive, betaFull]);

  const handleSignupClick = () => {
    if (!agreed) {
      setAgreeError(true);
      return;
    }
    if (!name || !email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }
    setFormError("");
    registerAndLogin();
  };

  const registerAndLogin = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setFormError("Email already registered. If you used Google before, sign in with Google.");
          return;
        }
        setFormError(data?.error ?? "Unable to create account.");
        return;
      }
      const result = await signIn("credentials", {
        redirect: true,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl: "/Enterprise",
      });
      if (result?.error || result?.ok === false) {
        setFormError("Account created. Please sign in with Google or try again.");
        return;
      }
      return;
    } catch {
      setFormError("Unable to create account.");
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
                  disabled
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="flex flex-col w-[350px] gap-1">
                <label htmlFor="username">Email</label>
                <input
                  className="w-full rounded-2xl border border-[#d0cccc] h-[45px] text-[15px] flex items-center pl-3 focus:outline-0"
                  type="email"
                  disabled
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="flex flex-col w-[350px] gap-1">
                <label htmlFor="username">Password</label>
                <input
                  className="w-full rounded-2xl border border-[#d0cccc] h-[45px] text-[15px] flex items-center pl-3 focus:outline-0"
                  type="password"
                  disabled
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </div>
      </div>
        {formError && (
          <div className="w-[350px] text-sm text-red-600 text-center">
            {formError}
          </div>
        )}
        <div className="w-[350px] flex flex-col gap-2">
            <label className={`flex items-center text-[15px] gap-2 ${agreeError && !agreed ? "text-red-600" : ""}`}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) setAgreeError(false);
                  }}
                />
                I agree to all Terms, Privacy Policy, and Fees.
            </label>
            {agreeError && !agreed && (
              <p className="text-xs text-red-600">You must agree before signing up.</p>
            )}
        </div>
        <div className="w-[350px]">
            <button
              onClick={handleSignupClick}
              className={`w-full rounded-2xl bg-black flex justify-center items-center h-[40px] text-[15px] text-white ${promoActive && betaFull ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              type="button"
              disabled={promoActive && betaFull}
            >
              SignUp
            </button>
        </div>
        <div className="w-[350px] flex">
            <p className="text-[15px] text-black/60">
              Already have an account? Use the sign‑in options above.
            </p>
        </div>
    </div>
  );
};

export default Signup;
