import {UserService} from '@/types/userService'
import {supabase} from '@/lib/db'



export async function getServiceByCategory(categories : string[], currentPage: number){
    const from = (currentPage - 1) * 10;
    const to = from + 10 - 1;

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


