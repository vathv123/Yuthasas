"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function PopupSignin() {
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const callbackUrl = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("callbackUrl") || "/Enterprise";
      const limitRes = await fetch("/api/auth/register/device-limit", { method: "GET" });
      const limitData = await limitRes.json().catch(() => null);
      if (limitRes.ok && limitData?.blocked) {
        setBlocked(true);
        return;
      }
      await signIn("google", { callbackUrl, redirect: true });
    };

    run().catch(() => {
      setError("Unable to continue Google sign in. Please try again.");
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      {blocked ? (
        <div className="text-center font-[Gilroy-Medium]">
          <p className="text-red-600 mb-3">This device already has 2 accounts.</p>
          <p className="text-black/70 mb-4">Remove one account in signup to continue.</p>
          <Link href="/authentications/signup" className="underline">
            Go to Signup
          </Link>
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p>Redirecting to Google...</p>
      )}
    </div>
  );
}
