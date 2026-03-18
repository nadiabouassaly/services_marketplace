import {UserService} from '@/types/userService'
import {supabase} from '@/lib/db'
import { UUID } from 'crypto';

export async function getServices(){
    const {data} = await supabase.from('services').select('*')

    return data as UserService[]
}

//fetching the services
export async function getServiceByCategory(categories : string[], currentPage: number, maxPrice: number = 100, search: string){
    const from = (currentPage - 1) * 12;
    const to = from + 12 - 1;
    const price = Number(maxPrice);

    let query = supabase.from('services').select('*', { count: 'exact' });

    if (search && search.trim() !== "") {
 
      query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`
      );

    }
  
    if (categories.length > 0) {
      query = query.in('category', categories);
    }
    
    if (maxPrice < 100) {
      query = query.lte('price', maxPrice);
    }
    
    query = query.range(from, to);
    const { data, count } = await query;
    
    return {
      services: data as UserService[],
      totalPages: count ?? 0,
    };
}

export async function createService(service: Omit<UserService, 'services_id' | 'created_at' | 'provider' | 'userprofile_id'>) {
    const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create service: ${text}`)
        }

    const created = await response.json();
    return created as UserService;
}

export async function getServicesById(id: UUID){
    const {data} = await supabase.from('services').select('*').eq('services_id', id).single();
    return data as UserService;
}


export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";

  if (seconds < 3600) return  (Math.floor(seconds / 60) === 1? `${Math.floor(seconds / 60)} minute ago` : `${Math.floor(seconds / 60)} minutes ago`);
  if (seconds < 86400) return (Math.floor(seconds / 3600) === 1? `${Math.floor(seconds / 3600)} hour ago` : `${Math.floor(seconds / 3600)} hours ago`);
  if (seconds < 2592000) return (Math.floor(seconds / 86400) === 1? `${Math.floor(seconds / 86400)} day ago` : `${Math.floor(seconds / 86400)} days ago`);
  return (Math.floor(seconds / 2592000) === 1 ? `${Math.floor(seconds / 2592000)} month ago` : `${Math.floor(seconds / 2592000)} months ago`);
}