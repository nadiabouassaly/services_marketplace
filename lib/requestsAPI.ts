import { supabase } from '@/lib/db';
import {request} from '@/types/request';

 
export type RequestWithService = request & {
  services: {
    name: string;
    price: number;
  };
  requester: {
    firstname: string;
    lastname: string;
    profilePicture: string | null;
  };
  provider: {
    firstname: string;
    lastname: string;
    profilePicture: string | null;
  };
};

export async function createRequest({ service, currentUser, form, }: {
  service: any;
  currentUser: { id: string | null }
  form: Pick<request, "message" | "budget" | "duration_requested" | "communication_method">;
}) {
  const { error } = await supabase.from("requests").insert({
    service_id: service.services_id,
    provider_id: service.userprofile_id,
    requester_id: currentUser.id,
    message: form.message,
    budget: form.budget || null,
    duration_requested: form.duration_requested || null,
    communication_method : form.communication_method,
  });

  return { error };
}

export async function fetchUserRequests(userId: string): Promise<RequestWithService[]> {
  // Step 1: fetch the requests
  if (!userId) return [];
  const { data: requests, error } = await supabase
  .from('requests')
  .select(`*, services ( name, price )`)
  .or(`requester_id.eq.${userId},provider_id.eq.${userId}`);

console.log('requests:', requests, 'error:', error);
  if (error) throw new Error(error.message);
  if (!requests?.length) return [];
  const userIds = [...new Set(requests.flatMap(r => [r.requester_id, r.provider_id]))];
  const { data: profiles, error: profilesError } = await supabase
    .from('userprofile')
    .select('userprofile_id, firstname, lastname, profilePicture')
    .in('userprofile_id', userIds);

  if (profilesError) throw new Error(profilesError.message);

  const profileMap = Object.fromEntries(profiles?.map(p => [p.userprofile_id, p]) ?? []);

  return requests.map(r => ({
    ...r,
    requester: profileMap[r.requester_id] ?? null,
    provider: profileMap[r.provider_id] ?? null,
  }));
}
 
export async function updateRequestStatus(
  id: string,
  status: request['status']
): Promise<void> {
  const { error } = await supabase
    .from('requests')
    .update({ status })
    .eq('id', id);
 
  if (error) throw new Error(error.message);
}
 
export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from('requests')
    .delete()
    .eq('request_id', id);
 
  if (error) throw new Error(error.message);
}