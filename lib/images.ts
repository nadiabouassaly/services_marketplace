import {image} from '@/types/userService'
import {supabase} from '@/lib/db'

export async function getImagesByServiceId(serviceId: string): Promise<image[]> {
    const response = await fetch(`/api/images?serviceId=${serviceId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch images');
    }   
    const data = await response.json();
    return data as image[];
}

export async function getImages(){
    const {data}= await supabase.from('images').select('*');
    return data as image[];
}