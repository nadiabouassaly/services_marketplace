export type Profile = {
    firstName : string
    middleName : string
    lastName : string
    userservice_id : number
    dateOfbirth : Date
    skills ?: string[]
    rating : number
    profession : string
    email : string
    services?: UserService[]
}

export type UserService = {
    services_id : number
    provider?: Profile
    name : string
    description : string
    price : number
    location : string
    category : "Tutoring" | "Babysitting" | "Elderly Help" | "Home Maintenance" | "Pet Care" | "Transportation" | "Other"
} 