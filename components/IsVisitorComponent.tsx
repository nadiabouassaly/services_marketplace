"use client"

import { useContext } from "react";
import { UserContext } from "@/app/auth/components/AuthModal";
import AuthGate from "@/app/auth/components/AuthGate";

export default function VisitorWrapper() {
  const visitor = useContext(UserContext);

  if (!visitor) {
    return <AuthGate closeOption={true} />;
  }

  return null;
}