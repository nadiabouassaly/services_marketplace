"use client";

import React, { useState } from "react";
import { supabase } from "./lib/supabase";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [profession, setProfession] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [skills, setSkills] = useState("");
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else {
          if (data?.user) {
            const profileData = {
              userprofile_id: data.user.id,
              email: data.user.email,
              firstname: firstname.trim(),
              middlename: middlename.trim() || null,
              lastname: lastname.trim(),
              profession: profession.trim() || null,
              phoneNumber: phoneNumber.trim(),
              dateofbirth: dateofbirth,
              skills: skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
            };

            const { error: insertError } = await supabase.from("userprofile").insert([profileData]);
            if (insertError) {
              console.error("Profile insert failed:", insertError);
              alert("Account created, but saving profile failed. Please try again.");
            } else {
              alert("Account and profile created successfully!");
            }
          } else {
            alert("Account created successfully! Check your email if confirmation is enabled.");
          }
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
              minLength={6}
              required
            />

            {!isLogin && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full border rounded-lg px-3 py-2"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    pattern="[A-Za-z\s]+"
                    title="Letters and spaces only"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full border rounded-lg px-3 py-2"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    pattern="[A-Za-z\s]+"
                    title="Letters and spaces only"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Middle Name (optional)"
                    className="w-full border rounded-lg px-3 py-2"
                    value={middlename}
                    onChange={(e) => setMiddlename(e.target.value)}
                    pattern="[A-Za-z\s]*"
                    title="Letters and spaces only"
                  />
                  <input
                    type="text"
                    placeholder="Profession"
                    className="w-full border rounded-lg px-3 py-2"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    pattern="[A-Za-z\s]*"
                    title="Letters and spaces only"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full border rounded-lg px-3 py-2"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    pattern="\d{7,15}"
                    title="Digits only, 7 to 15 characters"
                    required
                  />
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                    value={dateofbirth}
                    onChange={(e) => setDateofbirth(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Skills (comma separated)"
                  className="w-full border rounded-lg px-3 py-2"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </>
            )}

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