"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function AdminLoginPage() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = () => {

    setLoading(true);

    if (
      username === "Aftab" &&
      password === "Alibaba123@"
    ) {

      Cookies.set(
        "aafaq-admin-auth",
        "true",
        {
          expires: 7,
          path: "/",
        }
      );

      setTimeout(() => {

  window.location.href =
    "/invoice";

}, 100);
        

    } else {

      setError("Invalid login details");

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded mb-4"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
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

      </div>

    </div>
  );
}