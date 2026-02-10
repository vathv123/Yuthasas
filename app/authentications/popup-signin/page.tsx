"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function PopupSignin() {
  useEffect(() => {
    const callbackUrl = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("callbackUrl") || "/Enterprise";
    signIn("google", { callbackUrl, redirect: true });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to Google...</p>
    </div>
  );
}
