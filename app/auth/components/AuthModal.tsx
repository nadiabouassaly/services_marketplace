"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/app/auth/lib/supabase";
import { usePathname, useRouter} from "next/navigation";

export type AuthProp={
  closeOption: boolean
}

export const UserContext = createContext(false);
const SESSION_KEY = "auth_modal_seen"; 

export default function AuthModal({closeOption}: AuthProp) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [profession, setProfession] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [areaCodeWarning, setAreaCodeWarning] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [visitor, setVisitor] = useState(false);

  const path = usePathname() ;
  const router = useRouter();

  const isMainPage = path === "/";

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);

    if (alreadySeen && isMainPage) {
      // Already saw it this session and we're on the main page — don't show
      setShowModal(false);
    } else {
      // First time this session, or not on main page — show it
      setShowModal(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, [isMainPage]);

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
          setShowModal(false);
          window.location.reload()
        }
      } else {
        // Validate area code
        if (areaCode && !/^\+\d{1,3}$/.test(areaCode)) {
          alert("Area code must be + followed by 1 to 3 digits");
          setLoading(false);
          return;
        }

        // Check if user is at least 14 years old
        if (dateofbirth) {
          const birthDate = new Date(dateofbirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            // Birthday hasn't occurred yet this year
            if (age < 14 || (age === 14 && (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())))) {
              alert("Restricted for people younger than 14 years old");
              setLoading(false);
              return;
            }
          } else if (age < 14) {
            alert("Restricted for people younger than 14 years old");
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else {
          if (data?.user) {
            // Combine area code and phone number
            const combinedPhoneNumber = areaCode + " " + phoneNumber;

            const profileData = {
              userprofile_id: data.user.id,
              email: data.user.email,
              firstname: firstname.trim(),
              lastname: lastname.trim(),
              profession: profession.trim() || null,
              phoneNumber: combinedPhoneNumber,
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
              setShowModal(false);

            if(path == "\Profile" || path == "\Post")
            window.location.reload()

            }
          } else {
            alert("Account created successfully!");
            setShowModal(false);

            if(path == "\Profile" || path == "Post")
            window.location.reload()

          }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onClose=()=>{
    setShowModal(false);
  }

  if (!showModal) return null;

  const Visitor = ()=>{
    setShowModal(false) ;
    router.push("/")
    setVisitor(true)
  }

  if(visitor == true)
    setShowModal(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        {closeOption == true && <button
          onClick={()=>onClose()}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>}

        {closeOption == false && <button
          onClick={() =>Visitor()}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>}

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

              <input
                type="text"
                placeholder="Profession"
                className="w-full border rounded-lg px-3 py-2"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                pattern="[A-Za-z\s]*"
                title="Letters and spaces only"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="tel"
                  placeholder="Area Code"
                  className="w-full border rounded-lg px-3 py-2"
                  value={areaCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === "+" || /^\+\d{1,3}$/.test(value)) {
                      setAreaCode(value);
                      setAreaCodeWarning("");
                    } else {
                      setAreaCodeWarning("Area code must start with + followed by 1-3 digits");
                    }
                  }}
                  maxLength={4}
                  pattern="[+][0-9]{1,3}"
                  title="Plus followed by 1-3 digits"
                />
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
              </div>
              {areaCodeWarning && (
                <div className="text-red-500 text-sm">{areaCodeWarning}</div>
              )}

              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={dateofbirth}
                onChange={(e) => setDateofbirth(e.target.value)}
                required
              />

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
  );
}