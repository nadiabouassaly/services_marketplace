export type request = {
    id: string;
    requester_id : string;
    service_id : string;
    provider_id : string;
    message : string;
    budget : string;
    duration_requested: string;
    communication_method : string;
    status: "pending" | "accepted" | "rejected" | "completed";
}