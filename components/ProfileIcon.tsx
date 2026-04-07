"use client"

import { usePathname, useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

export default function ProfileIcon() {
  const path = usePathname();
  const router = useRouter() ;

  const enterProfilePage = ()=>{
    if(path != "/Profile"){
        router.push("/Profile")
      }
  }

  return (
    <div className="bg-gray-200 rounded-full p-2.5 cursor-pointer hover:bg-gray-300 transition-colors duration-300 ease-in-out" onClick={enterProfilePage}>
      <FaUser className="text-gray-400" />
    </div>
  );
}