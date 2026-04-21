export type request = {
    request_id: string; 
    requester_id : string;
    service_id : string;
    provider_id : string;
    message : string;
    budget : string;
    duration_requested: string;
    communication_method : string;
    status: "cancelled" | "pending" | "accepted" | "rejected" | "completed";
    created_at : string;
    hidden : boolean
}