import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { UUID } from "crypto";
import {Profile} from "@/types/userService" ;
import { getProfileByID } from "@/lib/services";
import styles from '@/components/Button.module.css'
import Card from '@/components/Card'

type SkillProp = {
    props: string[]
};

export default async function ProfilePage(){
    
    const id: UUID = "05975042-38a2-47cc-b785-03716544c5cd" ;
    const profile: Profile = await getProfileByID(id)

    const buttonStyle = {
        backgroundColor: "#007BFF",
        color: "white",
        padding: "2px 7px",
        textDecoration: "none",
        border: "1px solid #007BFF",
        margin: "13px 4px",
        borderRadius: "4px",
        fontSize: "15px",
        marginLeft: "12px",
        paddingLeft: "11px",
        marginBottom: "21px"
    };

    const date = new Date(profile.dateofbirth) ;
    const str = date.toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric"});

    const phoneNumber = profile.phoneNumber;
    const index = phoneNumber.indexOf(" ")
    const areaCode = phoneNumber.substring(0, index);
    const number = phoneNumber.substring(index+1);

    const skillsArray = profile.skills || [];
    return(
        <div style={{maxWidth: "900px",margin: "0 auto", paddingTop:"30px", paddingLeft:"20px", borderLeft: "1px solid #e5e7eb"}}>   

            <div className="flex items-start gap-4">

            <div style={{maxWidth: "240px"}}>

            <div style={{paddingLeft: "70px", borderBottom: "1px solid #e5e7eb"}}>
            <Image src={"/profileIcon.jpg"} alt="Default Profile Image" className = "rounded-full object-cover border-2 border-[#007bffeb] shadow-[0_0_5px_#B0BEC5] mt-1" width={120} height={120}/>
            <button style={buttonStyle}>Edit Profile</button>
            </div>

            <h2 className="mt-1 pl-[70px] mb-3">Services Provided</h2>
            
            <Card id="" name="Dog Walker Hamra" price={40} description="Hi, I can walk your dog in hamra anytime" category="Other"/>
            </div>  
            
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px"}}>
            <h1 className = "text-4xl font-bold mb-4.5" style={{color: "#1460b1"}}>My Profile</h1> 

            {/* Personal Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Personal Information</h2>

                <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>FIRST NAME</p>
                    <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{profile.firstname}</p>
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>LAST NAME</p>
                    <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{profile.lastname}</p>
                </div>

                </div>

                <p style={{color: "#4d5055", fontSize: "12px"}}>DATE OF BIRTH</p>

                <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "17px"}}>{str}</p>


            {/*Contact Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Contact Information</h2>

            <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>AREA CODE</p>
                    <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom: "11px"}}>{areaCode}</p>
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>PHONE NUMBER</p>
                    <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{number}</p>
                </div>

            </div>

            <p style={{color: "#4d5055", fontSize: "12px"}}>EMAIL</p>
            <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"266px", marginBottom: "17px"}}>{profile.email}</p>
            
            {/* Technical Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Technical Information</h2>

            <div className="flex items-start gap-4">

                <div>
                <p style={{color: "#4d5055", fontSize: "12px"}}>PROFESSION</p>
                <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{(profile.profession != null) ? profile.profession : " "}</p>
                </div>

                {skillsArray.length == 0 && <div>
                <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>P</p>
                <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", visibility: "hidden"}}>p</p>
                </div>}

                {skillsArray.length == 1 && <div>
                <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>
                <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{skillsArray[0]}</p>
                </div>
                }

            </div>

            {skillsArray.length > 1 && <Skills props={skillsArray}/>}

        </div>

        </div>
        </div>
    )
}

function Skills(skillsArray: SkillProp){

    const skills = skillsArray.props ;

    return(
    <>
        {skills.map((skill, index)=> 
            <div className="flex items-start gap-4" key={index}>

                <div>
                    {index == 0 && <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>}
                    {index == 0 && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}}>{skill}</p>}
                    {index >= 1 &&  <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}}>{skills[index+1]}</p>}
                </div>

                <div>
                    {index+1 == 1 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {(index+1) != skills.length && (index+1) == 1 && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+1]}</p>}
                    {(index+1) != skills.length && (index+1) > 1 && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+2]}</p>}
                </div>
            </div>
    )}
    </>
    )
}


