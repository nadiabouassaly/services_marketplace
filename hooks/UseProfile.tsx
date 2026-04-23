"use client"
import { getProfileByID } from "@/lib/services";
import { Profile, UserService } from "@/types/userService";
import { useEffect, useState } from "react";

export default function UseProfile(id: string){

    const [providerProfile, setProviderProfile] = useState<(Profile | null)>(null);

    useEffect(()=>{
        const getProfile = async ()=>{
            const profile = await getProfileByID(id) ;
            setProviderProfile(profile); 
        }
        getProfile();
    },[id])

    return {providerProfile} ;
}