import {UserService} from '@/types/userService'
import {supabase} from '@/lib/db'

export async function getServices(){
    const {data} = await supabase.from('services').select('*')

    return data as UserService[]
}

export async function getServiceByCategory(category : string){
    const {data} = await supabase.from('services').select('*').eq('category', category)

    return data as UserService[]
}
