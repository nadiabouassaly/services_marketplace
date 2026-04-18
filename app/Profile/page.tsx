"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import { Profile, UserService } from "@/types/userService";
import { getProfileByID, getServicesByUserId } from "@/lib/services";
import Card from "@/components/Card";
import InfoComponent from "../../components/InfoComponent";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id;

        if (!userId) {
          setError("Please log in to view your profile.");
          return;
        }

        const profileData = await getProfileByID(userId);
        if (!profileData) {
          setError("No profile found for the current user.");
        } else {
          setProfile(profileData);
        }

        const servicesData = await getServicesByUserId(userId);
        setServices(servicesData ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

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
    <div style={{ maxWidth: "980px", margin: "0 auto", paddingTop: "30px", paddingLeft: "20px", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
      <InfoComponent prop={profile} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[900px] ml-4 mt-3">
        {services.map((card) => (
          <Card
            key={card.services_id}
            id={card.services_id.toString()}
            name={card.name}
            price={card.price}
            description={card.description}
            category={card.category}
          />
        ))}
      </div>
    </div>
  );
}





