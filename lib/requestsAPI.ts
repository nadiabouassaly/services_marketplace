import { supabase } from '@/lib/db';
import {request} from '@/types/request';

 
export type RequestWithService = request & {
  services: {
    title: string;
    price: string;
  };
  requester: {
    full_name: string;
    avatar_url: string | null;
  };
  provider: {
    full_name: string;
    avatar_url: string | null;
  };
};

export async function createRequest({
  service,
  currentUser,
  form,
}: {
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
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      services ( title, price ),
      requester:userprofiles!requests_requester_id_fkey ( full_name, avatar_url ),
      provider:userprofiles!requests_provider_id_fkey ( full_name, avatar_url )
    `)
    .or(`requester_id.eq.${userId},provider_id.eq.${userId}`)
    .order('created_at', { ascending: false });
 
  if (error) throw new Error(error.message);
  return (data as RequestWithService[]) ?? [];
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
    .eq('id', id);
 
  if (error) throw new Error(error.message);
}