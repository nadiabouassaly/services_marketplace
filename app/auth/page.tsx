"use client";

import { useState } from "react";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>

      <form>
        {!isLogin && (
          <>
            <input type="text" placeholder="Name" />
            <br /><br />
          </>
        )}

        <input type="email" placeholder="Email" />
        <br /><br />

        <input type="password" placeholder="Password" />
        <br /><br />

        <button type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <br />

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </div>
  );
}