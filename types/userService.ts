export type Profile = {
    firstName : string
    middleName : string
    lastName : string
    id : number
    dateOfbirth : string
    skills : string[]
    rating : number
    profession : string
    email : string
    services?: UserService[]
}

export type UserService = {
    id : number
    provider?: Profile
    name : string
    description : string
    price : number
    location : string
    category : "Tutoring" | "Babysitting" | "Elderly Help" | "Home Maintenance" | "Pet Care" | "Transportation" | "Other"
}