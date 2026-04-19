"use client";

import { Suspense } from "react";
import InfoComponent from "../../components/InfoComponent";
import { useSearchParams } from "next/navigation";
import AuthGate from "../auth/components/AuthGate";
import { useProfileData } from "@/components/useProfileData";

export default function Page(){
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfilePage />
    </Suspense>
  );
}

function ProfilePage() {
  const searchParams = useSearchParams() ;

  const user = searchParams.get("id") || "" ;

  const { profile, services, isOwnProfile, signedIn } = useProfileData(user);

  if (signedIn === null) {
  return <div>Loading...</div>;
  }
  
  if (signedIn === false) {
    return <AuthGate closeOption={false}/>;
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <Suspense>
    <div style={{ maxWidth: "980px", margin: "0 auto", paddingTop: "30px", paddingLeft: "20px", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
      <InfoComponent prop={profile} logedInUser={isOwnProfile} services={services}/>
    </div>
    </Suspense>
  );
}





