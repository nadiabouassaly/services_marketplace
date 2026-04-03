import {image} from '@/types/userService'
import {supabase} from '@/lib/db'

export async function getImagesByServiceId(serviceId: string): Promise<image[]> {
    const {data} = await supabase.from('images').select("*").eq('service_id', serviceId); 
    return data as image[];
}

export async function getImages(){
    const {data}= await supabase.from('images').select('*');
    return data as image[];
}
