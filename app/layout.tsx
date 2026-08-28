"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import ScrollButtons from "@/components/ScrollButtons";
import ToastProvider from "@/components/ToastProvider";

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [warningFlash, setWarningFlash] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [beepInterval, setBeepInterval] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isProtectedPage, setIsProtectedPage] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /mobile|android|iphone|ipad|ipod|windows phone/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = language === "AR" ? "ar" : "en";
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const protectedPaths = ["/invoice", "/letter", "/quotation"];
    const isProtected = protectedPaths.some(path => pathname?.startsWith(path));
    setIsProtectedPage(isProtected);
  }, [pathname]);

  // ✅ Main idle timer – original logic + localStorage persistence
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isProtectedPage) return;

    const LOGOUT_MS = 120000;      // 2 minutes
    const WARNING_MS = 90000;      // 90 seconds (30 sec warning)

    let checkInterval: NodeJS.Timeout;
    let flashInt: NodeJS.Timeout;
    let warningActive = false;
    let countdownInt: NodeJS.Timeout;

    const logout = () => {
      document.cookie = "aafaq-admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem("aafaq-last-activity"); // ✅ clear stored timestamp
      window.location.href = "/admin-login";
    };

    // ✅ Get last activity from localStorage
    const getLastActivity = (): number => {
      const stored = localStorage.getItem("aafaq-last-activity");
      if (stored) {
        return parseInt(stored, 10);
      }
      return Date.now();
    };

    // ✅ Update last activity in localStorage
    const updateLastActivity = () => {
      const now = Date.now();
      localStorage.setItem("aafaq-last-activity", now.toString());
    };

    // ✅ On page load: check stored timestamp
    const lastActivity = getLastActivity();
    const idleTime = Date.now() - lastActivity;

    // If already idle for more than logout time → logout immediately
    if (idleTime >= LOGOUT_MS) {
      logout();
      return;
    }

    // --- All original warning functions (preserved) ---
    const playBeep = () => {
      if (isMobile) return;
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.3;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        oscillator.stop(audioCtx.currentTime + 0.3);
        if (audioCtx.state === "suspended") audioCtx.resume();
      } catch (e) {}
    };

    const vibrate = () => {
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(500);
      }
    };

    const showSystemNotification = () => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Session Expiring Soon", {
          body: "You will be logged out in 30 seconds due to inactivity.",
          icon: "/logo.png",
        });
      }
    };

    const startWarning = () => {
      if (warningActive) return;
      warningActive = true;
      setShowWarning(true);
      setCountdown(30);
      vibrate();
      showSystemNotification();
      countdownInt = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInt);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      if (!isMobile) {
        const beepTimer = setInterval(() => {
          if (warningActive) playBeep();
        }, 1000);
        setBeepInterval(beepTimer);
      }
      flashInt = setInterval(() => {
        setWarningFlash(prev => !prev);
      }, 500);
    };

    const stopWarning = () => {
      warningActive = false;
      setShowWarning(false);
      setWarningFlash(false);
      setCountdown(30);
      if (countdownInt) clearInterval(countdownInt);
      if (beepInterval) clearInterval(beepInterval);
      if (flashInt) clearInterval(flashInt);
      setBeepInterval(null);
    };

    const resetActivity = () => {
      updateLastActivity(); // ✅ update localStorage
      if (warningActive) {
        stopWarning();
      }
    };

    // ✅ If idle time already in warning zone (between 90s and 120s), start warning immediately
    if (idleTime >= WARNING_MS && idleTime < LOGOUT_MS) {
      startWarning();
    }

    // ✅ Periodic check using localStorage timestamp
    checkInterval = setInterval(() => {
      const now = Date.now();
      const stored = localStorage.getItem("aafaq-last-activity");
      const last = stored ? parseInt(stored, 10) : now;
      const idle = now - last;

      if (idle >= LOGOUT_MS) {
        logout();
      } else if (idle >= WARNING_MS && !warningActive) {
        startWarning();
      } else if (idle < WARNING_MS && warningActive) {
        stopWarning();
      }
    }, 1000);

    // ✅ Reset on user activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(ev => window.addEventListener(ev, resetActivity));

    // ✅ Reset when tab becomes visible again (original logic)
    const onVisibilityChange = () => {
      if (!document.hidden) {
        const stored = localStorage.getItem("aafaq-last-activity");
        const last = stored ? parseInt(stored, 10) : Date.now();
        const idle = Date.now() - last;

        if (idle >= LOGOUT_MS) {
          logout();
        } else if (idle >= WARNING_MS && !warningActive) {
          startWarning();
        } else if (idle < WARNING_MS && warningActive) {
          stopWarning();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // ✅ Ensure a timestamp exists
    if (!localStorage.getItem("aafaq-last-activity")) {
      updateLastActivity();
    }

    return () => {
      clearInterval(checkInterval);
      events.forEach(ev => window.removeEventListener(ev, resetActivity));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (countdownInt) clearInterval(countdownInt);
      if (beepInterval) clearInterval(beepInterval);
      if (flashInt) clearInterval(flashInt);
      stopWarning();
    };
  }, [isProtectedPage, isMobile]);

  return (
    <>
      <Navbar />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      <Analytics />
      <main className="min-h-screen bg-[var(--bg-body)] text-[var(--text-body)] transition-colors">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <ToastProvider />
      <ScrollButtons />
      {showWarning && isProtectedPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white rounded-lg p-6 max-w-md text-center transition-all duration-300 ${
              warningFlash ? "border-4 border-red-600 shadow-lg shadow-red-500" : "border border-gray-300"
            }`}
            style={{ animation: warningFlash ? "pulse 0.5s infinite" : "none" }}
          >
            <h3 className="text-xl font-bold mb-4 text-red-600">⚠️ Session Expiring Soon</h3>
            <p className="mb-4">
              You will be logged out due to inactivity in{" "}
              <strong className="text-2xl">{countdown}</strong> seconds.
            </p>
            <p className="text-sm text-gray-500 mb-4">Click below to stay logged in.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.dispatchEvent(new Event("click"))}
                className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  document.cookie = "aafaq-admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  localStorage.removeItem("aafaq-last-activity");
                  window.location.href = "/admin-login";
                }}
                className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-white text-black dark:bg-slate-950 dark:text-white">
        <ThemeProvider>
          <LanguageProvider>
            <RootLayoutInner>{children}</RootLayoutInner>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}