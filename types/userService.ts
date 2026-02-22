export type Profile = {
    firstName : string
    middleName : string
    lastName : string
    id : number
    dateOfbirth : string
    skills : string[]
    rating : number
    profession : string
    services : UserService[]
}

export type UserService = {
    id : number
    provider : Profile
    name : string
    description : string
    price : number
    location : string
}