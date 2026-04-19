"use client"

import Logo from './Logo';
import NavbarButton from './NavbarButton';
import ProfileIcon from './ProfileIcon';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FaBell, FaRegBell } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const pathName = usePathname();
  
  return (
    <Suspense fallback={null}>
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />

        {/* Center Search bar */}
        {(pathName == "/") && <SearchBar/>}

        <div className="flex items-center space-x-4">
          {(pathName != "/Profile") && <ProfileIcon id={""}/>}
          {(pathName == "/" || pathName == "/Profile") && <NavbarButton onClick={()=>router.push("/Post")}>+ Post a Service</NavbarButton>}
          <button>
            <FaBell className="text-2xl text-blue-500 cursor-pointer" />
            
          </button>
          
        </div>
      </div>
    </nav>
    </Suspense>
  );
}

function SearchBar(){

    const searchParam = useSearchParams();
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();

    const [search, setSearch] = useState<string>(() => {
    const searchURL = searchParam.get("search");
    return searchURL ? searchURL : ""
    });
    
    useEffect(()=>{
      const params = new URLSearchParams(searchParam.toString());

      params.set("search", search)
      params.set("page","1")
      router.replace(`?${params.toString()}`);

    },[search])

    useEffect(() => {

    if(inputValue != "")return;
    
    const params = new URLSearchParams(searchParam.toString());

    params.set("search","")
    params.set("page","1")
    router.replace(`?${params.toString()}`);

    const timer = setTimeout(() => {
    setSearch(inputValue); // fires setSearch automatically after 500ms
    }, 2000);

    return () => clearTimeout(timer);
    }, [inputValue]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    };
  
    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key == "Enter")
    setSearch(inputValue);
    };

  return (
    <div className="flex-1 mx-6 relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            onKeyDown={handleOnKeyDown}
            onChange={handleChange}
            placeholder="Search Services"
            className="w-full pl-11 pr-6 py-2 rounded-md bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a74ff]"
          />
        </div>
  );
}