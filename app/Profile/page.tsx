"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import { Profile, UserService } from "@/types/userService";
import { getProfileByID, getServicesByUserId } from "@/lib/services";
import InfoComponent from "../../components/InfoComponent";
import { useSearchParams } from "next/navigation";

export default function Page(){
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfilePage />
    </Suspense>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams() ;
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const user = searchParams.get("id") || "" ;

  useEffect(()=>{

    async function getUser() {
    const { data } = await supabase.auth.getSession();

    const userId = data.session?.user?.id ;

    if(!userId){
      console.log("please sign in first") ;
      return ;
    }

    const targetUserId = user || userId!;
    const profileData = await getProfileByID(targetUserId);

    setProfile(profileData);
    setIsOwnProfile(targetUserId === userId);
    }
    
    getUser() ;
  },[user])

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





