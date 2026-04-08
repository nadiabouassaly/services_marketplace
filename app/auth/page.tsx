"use client";

import { useState } from "react";

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen bg-gray-100 relative">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Services Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Find and offer services in your community.
        </p>
      </div>

      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            <form className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border rounded-lg px-3 py-2"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg px-3 py-2"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-4 w-full text-blue-600 font-medium hover:underline"
            >
              {isLogin ? "Switch to Sign Up" : "Switch to Login"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}