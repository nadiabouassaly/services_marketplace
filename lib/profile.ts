import {supabase} from '@/lib/db'
import { Profile } from '@/types/userService';

export default async function updateProfile(userId: string, profile: Profile) {
    
    const { error } = await supabase
        .from("userprofile")
        .update({
            firstname: profile.firstname,
            middlename: profile.middlename,
            lastname: profile.lastname,
            userprofile_id: profile.userprofile_id,
            dateofbirth: profile.dateofbirth,
            skills: profile.skills ?? null,
            profession: profile.profession,
            email: profile.email,
            phoneNumber: profile.phoneNumber
        })
        .eq("userprofile_id", userId)

      if (error) {
      console.error("Update failed:", JSON.stringify(error))
    }
}