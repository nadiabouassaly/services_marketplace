"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { supabase } from "@/app/auth/lib/supabase";

type User = {
  id: string;
}

function ProfileIconInner({ id }: User) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPicture = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("userprofile")
        .select("profilePicture")
        .eq("userprofile_id", user.id)
        .single();

      if (!error && data?.profilePicture) {
        setPictureUrl(data.profilePicture);
      }
    };

    fetchPicture();
  }, []);

  const userId = id;
  params.set("id", userId);

  return (
    <div
      className="rounded-full cursor-pointer overflow-hidden hover:opacity-80 transition-opacity duration-300 ease-in-out"
      style={{ width: "36px", height: "36px" }}
      onClick={() => router.push(`/Profile?${params.toString()}`)}
    >
      {pictureUrl ? (
        <img src={pictureUrl} className="w-full h-full object-cover" />
      ) : (
        <div className="bg-gray-200 hover:bg-gray-300 w-full h-full flex items-center justify-center">
          <FaUser className="text-gray-400" />
        </div>
      )}
    </div>
  );
}

export default function ProfileIcon({ id }: User) {
  return (
    <Suspense fallback={
      <div className="bg-gray-200 rounded-full p-2.5">
        <FaUser className="text-gray-400" />
      </div>
    }>
      <ProfileIconInner id={id} />
    </Suspense>
  );
}