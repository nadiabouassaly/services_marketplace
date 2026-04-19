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

export async function uploadImages(files: FileList) {
  const urls: string[] = [];

  for (const file of Array.from(files)) {
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("service-images")
      .upload(`services/${fileName}`, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("service-images")
      .getPublicUrl(data.path);

    urls.push(publicUrl.publicUrl);
  }

  return urls;
}

export async function addImages(serviceId: string, urls: string[], userId: string) {
  const rows = urls.map((url, index) => ({
    service_id: serviceId,
    file_path: url,
    user_id: userId,
    image_type: "service",
    is_primary: index === 0,
  }));

  const { data, error } = await supabase.from("images").insert(rows);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}