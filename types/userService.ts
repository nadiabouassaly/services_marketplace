
export type Profile = {
    firstname : string
    middlename : string
    lastname : string
    userprofile_id : string
    dateofbirth : Date
    skills ?: string[]
    rating : number
    profession : string
    email : string
    services?: UserService[]
    phoneNumber: string
}

export type UserService = {
    userprofile_id ?: string
    services_id : string
    provider?: Profile
    name : string
    description : string
    price : number
    location : string
    created_at : string
    category : "Tutoring" | "Babysitting" | "Elderly Care" | "Home Maintenance" | "Pet Care" | "Transportation" | "Other"
}

export type image = {
    id : number;
    upload_at : string;
    user_id : string;
    service_id : string;
    file_path : string;
    image_type : string;
    is_primary? : boolean;
}
