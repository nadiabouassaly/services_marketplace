"use client";

import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else {
          alert("Logged in successfully!");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else {
          alert("Account created successfully! Check your email if confirmation is enabled.");
        }
      }
    } catch (error) {
      alert("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 relative">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Services Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Find and offer services in your community.
        </p>
      </div>

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
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
    </main>
  );
}