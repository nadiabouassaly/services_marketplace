import {UserService} from '@/types/userService'
import {supabase} from '@/lib/db'
import { UUID } from 'crypto';

export async function getServices(){
    const {data} = await supabase.from('services').select('*')

    return data as UserService[]
}

export async function getServiceByCategory(categories : string[], currentPage: number){
    const from = (currentPage - 1) * 12;
    const to = from + 12 - 1;

    if(categories.length == 0){
        const {data, count} = await supabase.from('services').select('*',{ count: 'exact' }).range(from, to)
        return {
        services: data as UserService[],
        totalPages: count ?? 0
        }
    }
    
    else{
    const {data, count} = await supabase.from('services').select('*', { count: 'exact'} ).in('category', categories).range(from, to)
    return {
        services: data as UserService[],
        totalPages: count ?? 0
        }
    }
}

export async function getServicesById(id: UUID){
    const {data} = await supabase.from('services').select('*').eq('services_id', id).single();
    return data as UserService;
}


export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return  (Math.floor(seconds / 60) === 1? `${Math.floor(seconds / 60)} MINUTE AGO` : `${Math.floor(seconds / 60)} MINUTES AGO`);
  if (seconds < 86400) return (Math.floor(seconds / 3600) === 1? `${Math.floor(seconds / 3600)} HOUR AGO` : `${Math.floor(seconds / 3600)} HOURS AGO`);
  if (seconds < 2592000) return (Math.floor(seconds / 86400) === 1? `${Math.floor(seconds / 86400)} DAY AGO` : `${Math.floor(seconds / 86400)} DAYS AGO`);
  return (Math.floor(seconds / 2592000) === 1 ? `${Math.floor(seconds / 2592000)} MONTH AGO` : `${Math.floor(seconds / 2592000)} MONTHS AGO`);
}

