"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import AuthModal, { AuthProp } from "./AuthModal";

export default function AuthGate({closeOption}: AuthProp) {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setShow(true); // only show if NOT logged in
      }

      setChecked(true);
    }

    checkSession();
  }, []);

  if (!checked) return null;

  return <>{show && <AuthModal closeOption={closeOption}/>}</>;
}