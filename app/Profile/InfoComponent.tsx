"use client"

import { Profile } from "@/types/userService"
import { useState } from "react";
import Image from "next/image";

type InfoProp = {
    prop: Profile
}

type SkillProp = {
    props: string[]
};

export default function InfoComponent(profile: InfoProp){

    const [useEditing, setEditing] = useState(false) ;

    const date = new Date(profile.prop.dateofbirth) ;
    const str = date.toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric"});

    const phoneNumber = profile.prop.phoneNumber;
    const index = phoneNumber.indexOf(" ")
    const areaCode = phoneNumber.substring(0, index);
    const number = phoneNumber.substring(index+1);

    const skillsArray = profile.prop.skills || [];

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

    const buttonStyle2 ={
        backgroundColor: "#007BFF",
        color: "white",
        padding: "2px 7px",
        textDecoration: "none",
        border: "1px solid #007BFF",
        margin: "13px 4px",
        borderRadius: "4px",
        fontSize: "15px",
        marginLeft: "5px",
        paddingLeft: "11px",
        marginBottom: "21px"
    };

    return(
            <div className="flex items-start gap-4">

            <div style={{width: "275px"}}>

            <div style={{paddingLeft: "70px"}}>
            <Image src={"/profileIcon.jpg"} alt="Default Profile Image" className = "rounded-full object-cover border-2 border-[#007bffeb] shadow-[0_0_5px_#B0BEC5] mt-1" width={120} height={120}/>
            {useEditing != true && <button style={buttonStyle} onClick={()=>setEditing(true)}>Edit Profile</button>}
            {useEditing == true && <button style={buttonStyle2}onClick={()=>setEditing(false)}>Save changes</button>}
            </div>

            </div>  
            
            <div style={{ display: "flex", flexDirection: "column"}}>
            <h1 className = "text-4xl font-bold mb-4.5" style={{color: "#1460b1"}}>My Profile</h1> 

            <div className="flex items-start gap-5">
            
            <div>
            {/* Personal Info Section */}

            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Personal Information</h2>

                <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>FIRST NAME</p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{profile.prop.firstname}</p>}
                    {useEditing == true && <input style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={profile.prop.firstname}/>}
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>LAST NAME</p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{profile.prop.lastname}</p>}
                    {useEditing == true && <input style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={profile.prop.lastname}/>}
                </div>

                </div>

                <p style={{color: "#4d5055", fontSize: "12px"}}>DATE OF BIRTH</p>
                {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "17px"}}>{str}</p>}
                {useEditing == true && <input style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={str}/>}

            </div>

            <div>
            {/*Contact Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Contact Information</h2>

            <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>AREA CODE</p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom: "11px"}}>{areaCode}</p>}
                    {useEditing == true && <input style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={areaCode}/>}
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>PHONE NUMBER</p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{number}</p>}
                    {useEditing == true && <input style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={number}/>}
                </div>

            </div>
            <p style={{color: "#4d5055", fontSize: "12px"}}>EMAIL</p>
            {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"266px", marginBottom: "17px"}}>{profile.prop.email}</p>}
            {useEditing == true && <input style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"266px", marginBottom: "17px", resize:"none"}} defaultValue={profile.prop.email}/>}
            </div>
            </div> {/*end of flex- gap-5 div*/}

            {/* Technical Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Technical Information</h2>

            <div className="flex items-start gap-4">

                <div>
                <p style={{color: "#4d5055", fontSize: "12px"}}>PROFESSION</p>
                {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{(profile.prop.profession != null) ? profile.prop.profession : " "}</p>}
                {useEditing == true && <input style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={(profile.prop.profession != null) ? profile.prop.profession : " "}/>}
                </div>

                <div>
                    <Skills props={skillsArray}/>
                </div>


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
                    {index >= 2 &&  <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}}>{skills[index+1]}</p>}
                </div>

                <div>
                    {index+1 == 1 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {(index+1) != skills.length && (index+1) == 1 && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+1]}</p>}
                    {(index+1) != skills.length && (index+1) > 1 && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+2]}</p>}
                </div>

                <div>
                    {index+2 == 2 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {(index+2) != skills.length && (index+2) == 2 && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+2]}</p>}
                    {(index+2) != skills.length && (index+2) > 2 && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+3]}</p>}
                </div>

                {index == skills.length-1 || index+1 == skills.length-1 || index+2 == skills.length-1 && <div>
                <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>
                <button style={{ textDecoration: "none", border: "1px solid #007BFF", paddingLeft: "8px", fontSize: "15px", color: "#4d5055", borderRadius: "4px", paddingRight: "7px"}}>Add Skill</button>
                </div>}

            </div>
    )}
    </>
    )
}
