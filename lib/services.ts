import {UserService} from '@/types/userService'
import {supabase} from '@/lib/db'

export async function getServices(){
    const {data} = await supabase.from('services').select('*')

    return data as UserService[]
}

export async function getServiceByCategory(categories : string[]){

    if(categories.length == 0)
    return getServices() ;
    
    else{
    const {data} = await supabase.from('services').select('*').in('category', categories)
    return data as UserService[]
    }
}

