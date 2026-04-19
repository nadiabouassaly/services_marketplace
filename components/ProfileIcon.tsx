"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaUser } from 'react-icons/fa';

type User = {
  id: string ;
}

export default function ProfileIcon({id}:User) {
  const router = useRouter() ;
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const userId = id ;
  params.set("id", userId);

  return (
    <Suspense>
    <div className="bg-gray-200 rounded-full p-2.5 cursor-pointer hover:bg-gray-300 transition-colors duration-300 ease-in-out" onClick={()=>router.push(`/Profile?${params.toString()}`)}>
      <FaUser className="text-gray-400" />
    </div>
    </Suspense>
  );
}