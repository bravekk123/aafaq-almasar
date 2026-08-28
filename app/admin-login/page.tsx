"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  const loginSuccess = () => {
    Cookies.set(
      "aafaq-admin-auth",
      "true",
      {
        expires: 1,
        path: "/",
        secure: true,
        sameSite: "strict",
      }
    );

    localStorage.setItem(
      "aafaq-trusted-device",
      Date.now().toString()
    );

    window.location.href = "/invoice";
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    if (
      username !== "info@aafaqalmasar.ae" ||
      password !== "Alibaba123@"
    ) {
      setError("Invalid login details");
      setLoading(false);
      return;
    }

    const trustedDevice =
      localStorage.getItem(
        "aafaq-trusted-device"
      );

    let isNewDevice = true;

    if (trustedDevice) {
      const lastVerified =
        parseInt(trustedDevice);

      const thirtyDays =
        30 * 24 * 60 * 60 * 1000;

      if (
        Date.now() - lastVerified <
        thirtyDays
      ) {
        isNewDevice = false;
      }
    }

    if (!isNewDevice) {
      loginSuccess();
      return;
    }

    try {
      await fetch(
        "/api/send-login-alert",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: username,
            browser:
              navigator.userAgent,
          }),
        }
      );

      await fetch(
        "/api/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: username,
          }),
        }
      );

      setShowOtpScreen(true);
    } catch (error) {
      console.error(error);
      setError(
        "Failed to send verification code"
      );
    }

    setLoading(false);
  };

  const handleVerifyOtp =
    async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await fetch(
            "/api/verify-otp",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                email: username,
                otp,
              }),
            }
          );

        const result =
          await response.json();

        if (!result.success) {
          setError(
            "Invalid or expired OTP"
          );
          setLoading(false);
          return;
        }

        loginSuccess();
      } catch (error) {
        console.error(error);
        setError(
          "Verification failed"
        );
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {!showOtpScreen ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded mb-4"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded mb-4"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            {error && (
              <p className="text-red-600 mb-4">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-black text-white p-3 rounded-lg font-bold"
            >
              {loading
                ? "Please wait..."
                : "Login"}
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-center">
              A 6-digit verification code
              has been sent to your email.
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-3 rounded mb-4"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
            />

            {error && (
              <p className="text-red-600 mb-4">
                {error}
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-bold"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}