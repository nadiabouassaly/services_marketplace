"use client"

import Logo from './Logo';
import NavbarButton from './NavbarButton';
import ProfileIcon from './ProfileIcon';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'react-router-dom';

export default function Navbar() {
  const router = useRouter();
  const pathName = usePathname();
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />

        {/* Center Search bar */}
        {(pathName == "/") && <SearchBar/>}

        <div className="flex items-center space-x-4">
          <ProfileIcon />
          {(pathName == "/") && <NavbarButton onClick={()=>router.push("/Post")}>+ Post a Service</NavbarButton>}
        </div>
      </div>
    </nav>
  );
}

function SearchBar(){

  return (
    <div className="flex-1 mx-6 relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search Services"
            className="w-full pl-11 pr-6 py-2 rounded-md bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a74ff]"
          />
        </div>
  );
}