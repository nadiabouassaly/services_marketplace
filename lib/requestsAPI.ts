import { supabase } from '@/lib/db';
import {request} from '@/types/request';

export async function createRequest({
  service,
  currentUser,
  form,
}: {
  service: any;
  currentUser: { id: string };
  form: Pick<request, "message" | "budget" | "duration_requested">;
}) {
  const { error } = await supabase.from("requests").insert({
    service_id: service.services_id,
    provider_id: service.userprofile_id,
    requester_id: currentUser.id,
    message: form.message,
    budget: form.budget || null,
    duration_requested: form.duration_requested || null,
  });

  return { error };
}
