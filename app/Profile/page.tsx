import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { UUID } from "crypto";
import {Profile, UserService} from "@/types/userService" ;
import { getProfileByID, getServiceByCategory, getServices, getServicesById } from "@/lib/services";
import Card from "@/components/Card"
import InfoComponent from "../../components/InfoComponent";

export default async function ProfilePage(){
    
    // NEED TO CHANGE BASED ON ID
    const id: UUID = "05975042-38a2-47cc-b785-03716544c5cd" ;
    const profile: Profile = await getProfileByID(id)
    const services: UserService[] = await getServices();

    return(
        <div style={{maxWidth: "980px",margin: "0 auto", paddingTop:"30px", paddingLeft:"20px", borderLeft: "1px solid #e5e7eb", borderRight:"1px solid #e5e7eb"}}>   

        <InfoComponent prop={profile}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[900px] ml-4 mt-3">
        
        {services.map((card) => (
        <Card key={card.services_id}
              id={card.services_id.toString()} 
              name = {card.name}
              price = {card.price}
              description={card.description}
              category={card.category}
        />
        ))}    

        </div>

        </div>
    )
}





