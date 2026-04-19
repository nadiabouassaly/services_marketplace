"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import { Profile, UserService } from "@/types/userService";
import { getProfileByID, getServicesByUserId } from "@/lib/services";
import InfoComponent from "../../components/InfoComponent";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams() ;
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const user = searchParams.get("id") || "" ;

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await supabase.auth.getUser();
        const loggedInUserId = data.user?.id;

        if (!loggedInUserId && !user) {
          setError("No user found.");
          return;
        }

        const isOwnProfile = user
          ? user === loggedInUserId
          : true;

        const targetUserId = user || loggedInUserId;

        const profileData = await getProfileByID(targetUserId!);
        if (!profileData) {
          setError("No profile found.");
        } else {
          setProfile(profileData);
        }

        const servicesData = await getServicesByUserId(targetUserId!);
        setServices(servicesData ?? []);

        // optional: store it in state if InfoComponent needs it
        setIsOwnProfile(isOwnProfile);

      } catch (err) {
        console.error(err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Suspense>
    <div style={{ maxWidth: "980px", margin: "0 auto", paddingTop: "30px", paddingLeft: "20px", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
      <InfoComponent prop={profile} logedInUser={isOwnProfile} services={services}/>
    </div>
    </Suspense>
  );
}





