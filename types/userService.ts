//comment

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
}

export type UserService = {
    userprofile_id ?: string
    services_id : string
    provider?: Profile
    name : string
    description : string
    price : number
    location : string
    category : "Tutoring" | "Babysitting" | "Elderly Care" | "Home Maintenance" | "Pet Care" | "Transportation" | "Other"
} 