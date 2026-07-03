"use client";

import { useState, useEffect, useRef } from "react";
import { X, Share, Plus } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | null;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return null;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

const DISMISSED_KEY = "pwa-banner-dismissed-v1";

export function AddToHomeScreen() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const deferredPrompt = useRef<InstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const p = detectPlatform();
    if (!p) return;

    if (p === "android") {
      const handler = (e: Event) => {
        e.preventDefault();
        deferredPrompt.current = e as InstallPromptEvent;
        setPlatform("android");
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }

    if (p === "ios") {
      setPlatform("ios");
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    setShow(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  }

  async function install() {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === "accepted") {
        deferredPrompt.current = null;
        setShow(false);
      }
    }
  }

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="dialog"
      aria-label="Add to home screen"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[var(--payout-blue)] p-4 shadow-2xl shadow-blue-900/40">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Dismiss"
        >
          <X size={12} />
        </button>

        {/* Icon + text */}
        <div className="flex items-start gap-3 pr-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <span className="text-sm font-black text-white">PL</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Add to Home Screen</p>
            <p className="mt-0.5 text-xs leading-relaxed text-blue-100">
              {platform === "ios"
                ? 'Tap the share button below, then choose "Add to Home Screen" for quick access.'
                : "Install Payout Lite for a full-screen experience with offline support."}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-3">
          {platform === "android" && (
            <button
              onClick={install}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-[var(--payout-blue)] shadow-sm transition hover:bg-blue-50 active:scale-[.98]"
            >
              <Plus size={15} />
              Install app
            </button>
          )}

          {platform === "ios" && (
            <div className="flex items-center justify-center gap-3 rounded-xl bg-white/10 py-2.5 text-xs text-blue-100">
              <span className="flex items-center gap-1">
                Tap <Share size={13} className="inline text-white" />
              </span>
              <span className="text-white/40">→</span>
              <span className="flex items-center gap-1">
                then <strong className="text-white">"Add to Home Screen"</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Arrow for iOS pointing down */}
      {platform === "ios" && (
        <div className="mx-auto mt-1 h-2 w-4 overflow-hidden">
          <div className="mx-auto h-3 w-3 rotate-45 bg-[var(--payout-blue)]" />
        </div>
      )}
    </div>
  );
}
