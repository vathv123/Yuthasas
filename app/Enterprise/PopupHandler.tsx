"use client";

import { useEffect } from "react";

export default function PopupHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.opener) {
        window.opener.postMessage({ type: "nextauth:signin", success: true }, window.location.origin);
        setTimeout(() => window.close(), 500);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
