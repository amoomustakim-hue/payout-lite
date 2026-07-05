"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Clock } from "lucide-react";

const TIMEOUT_MS = 30 * 60 * 1000;       // 30 minutes
const WARNING_MS = TIMEOUT_MS - 2 * 60 * 1000; // show warning at 28 minutes

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
  "visibilitychange",
] as const;

export function InactivityLogout() {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();
    setShowWarning(false);

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(120);
      countdownInterval.current = setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);
    }, WARNING_MS);

    logoutTimer.current = setTimeout(() => {
      signOut({ redirectUrl: "/sign-in?reason=inactivity" });
    }, TIMEOUT_MS);
  }, [clearTimers, signOut]);

  const resetActivity = useCallback(() => {
    if (showWarning) return; // don't reset once warning is shown
    startTimers();
  }, [showWarning, startTimers]);

  useEffect(() => {
    if (!isSignedIn) return;

    startTimers();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetActivity, { passive: true });
    }

    return () => {
      clearTimers();
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetActivity);
      }
    };
  }, [isSignedIn, startTimers, resetActivity, clearTimers]);

  function staySignedIn() {
    setShowWarning(false);
    startTimers();
  }

  function logOutNow() {
    clearTimers();
    signOut({ redirectUrl: "/sign-in" });
  }

  if (!isSignedIn || !showWarning) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-amber-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Session expiring</p>
              <p className="text-sm text-amber-700">
                You have been inactive for a while
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
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

        {/* Actions */}
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
