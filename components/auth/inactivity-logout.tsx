"use client";

import { useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Clock } from "lucide-react";

const TIMEOUT_MS = 30 * 60 * 1000;
const WARN_BEFORE_MS = 2 * 60 * 1000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
] as const;

export function InactivityLogout() {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);

  // All mutable state lives in refs so the effect never needs to re-run
  const lastActivityAt = useRef(Date.now());
  const warningShown = useRef(false);
  const didSignOut = useRef(false);
  // Keep a stable ref to signOut so the interval always calls the latest version
  const signOutRef = useRef(signOut);
  useEffect(() => { signOutRef.current = signOut; });

  useEffect(() => {
    if (!isSignedIn) return;

    lastActivityAt.current = Date.now();
    warningShown.current = false;
    didSignOut.current = false;

    function onActivity() {
      if (warningShown.current) return;
      lastActivityAt.current = Date.now();
    }

    for (const ev of ACTIVITY_EVENTS) {
      window.addEventListener(ev, onActivity, { passive: true });
    }

    const interval = setInterval(() => {
      if (didSignOut.current) return;

      const idle = Date.now() - lastActivityAt.current;
      const remaining = Math.max(0, TIMEOUT_MS - idle);

      if (idle >= TIMEOUT_MS) {
        didSignOut.current = true;
        clearInterval(interval);
        signOutRef.current({ redirectUrl: "/sign-in?reason=inactivity" });
        return;
      }

      if (remaining <= WARN_BEFORE_MS && !warningShown.current) {
        warningShown.current = true;
        setShowWarning(true);
      }

      if (warningShown.current) {
        setSecondsLeft(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      for (const ev of ACTIVITY_EVENTS) {
        window.removeEventListener(ev, onActivity);
      }
    };
  }, [isSignedIn]); // stable — no function deps that change

  function staySignedIn() {
    warningShown.current = false;
    lastActivityAt.current = Date.now();
    setShowWarning(false);
    setSecondsLeft(120);
  }

  function logOutNow() {
    didSignOut.current = true;
    signOut({ redirectUrl: "/sign-in" });
  }

  if (!isSignedIn || !showWarning) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        <div className="bg-amber-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Session expiring</p>
              <p className="text-sm text-amber-700">You have been inactive for a while</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            For security, you will be automatically signed out in:
          </p>
          <p className="mt-3 text-center text-4xl font-black tabular-nums tracking-tight text-slate-900">
            {mins}:{secs}
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            Move your mouse or press any key to stay signed in
          </p>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={logOutNow}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
          >
            <LogOut size={14} />
            Sign out
          </button>
          <button
            onClick={staySignedIn}
            className="flex-1 rounded-xl bg-[var(--payout-blue)] py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--payout-blue-dark)]"
          >
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  );
}
