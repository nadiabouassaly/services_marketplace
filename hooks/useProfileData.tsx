"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import { getProfileByID, getServicesByUserId } from "@/lib/services";
import { Profile, UserService } from "@/types/userService";

export function useProfileData(userParam: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<UserService[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;

      if (!userId && !userParam) {
        setSignedIn(false);
        return;
      }

      setSignedIn(!!userId);

      const targetUserId = userParam || userId!;

      const [profileData, servicesData] = await Promise.all([
        getProfileByID(targetUserId),
        getServicesByUserId(targetUserId)
      ]);

      setProfile(profileData);
      setServices(servicesData ?? []);
      setIsOwnProfile(targetUserId === userId);
    }

    loadData();
  }, [userParam]);

  return { profile, services, isOwnProfile, signedIn };
}