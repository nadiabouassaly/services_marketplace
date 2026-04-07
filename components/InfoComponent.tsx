"use client"

import { Profile } from "@/types/userService"
import { useContext, useState, createContext, useEffect, useRef} from "react";
import Image from "next/image";
import updateProfile from "@/lib/profile";

const UserContext = createContext(false) ;
const ContextProvider = createContext<string[]>([]);

type InfoProp = {
    prop: Profile
}

type SkillProp = {
    props: string[]
    skills: string[]
    setSkills: React.Dispatch<React.SetStateAction<string[]>>
};

export default function InfoComponent(profile: InfoProp){

    const [useEditing, setEditing] = useState(false) ;
    const [useValidInputs, setValidInputs] = useState(true) ;
    const [useSaving, setSaving] = useState(false);
    const [useProfile, setProfile] = useState(profile.prop)

    
    const date = new Date(useProfile.dateofbirth) ;
    const str = date.toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric"});

    const phoneNumber = useProfile.phoneNumber;
    const index = phoneNumber.indexOf(" ")
    const areaCode = phoneNumber.substring(0, index);
    const number = phoneNumber.substring(index+1);

    const [phone, setPhone] = useState({
    areaCode: areaCode,
    number: number
    })

    const [useSkills, setSkills] = useState(useProfile.skills || []);

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
    
    const onSave=(e: React.FormEvent<HTMLFormElement>)=>{

        e.preventDefault();
        setSaving(true);

        const form = e.currentTarget;
        if (form.checkValidity()) {
        setValidInputs(true);
        setEditing(false);
        handleSave() ;
        } else {
        setValidInputs(false);
        }
    }

    
    const handleSave = async () => {
        const fullPhone = areaCode + " " + number

        const filteredSkills = useSkills.filter(skill => skill.trim() !== "") // remove empty

        const updatedProfile = {
         ...useProfile,
        phoneNumber: fullPhone,
        skills: filteredSkills
    }
        const error  = await updateProfile(profile.prop.userprofile_id, updatedProfile)
    
        setProfile(updatedProfile)
        setSkills(filteredSkills) // update local state too so display is clean
    }

    return(
            <UserContext.Provider value={useEditing}>
            <form onSubmit={onSave} noValidate>
            <div className="flex items-start gap-4">
            <div style={{width: "275px"}}>

            <div style={{paddingLeft: "70px"}}>
            <Image src={"/profileIcon.jpg"} alt="Default Profile Image" className = "rounded-full object-cover border-2 border-[#007bffeb] shadow-[0_0_5px_#B0BEC5] mt-1" width={120} height={120}/>
            {useEditing != true && <button style={buttonStyle} onClick={()=>setEditing(true)}>Edit Profile</button>}
            {useEditing == true && <button type = "submit" style={buttonStyle2} >Save changes</button>}
            </div>

            </div>  
            
            <div style={{ display: "flex", flexDirection: "column"}}>
            <h1 className = "text-4xl font-bold mb-4.5" style={{color: "#1460b1"}}>My Profile</h1> 
            {useValidInputs == false && useSaving == true && <p style={{marginTop:"-7px", marginBottom:"5px", fontSize:"15px", color:"red"}}>Please fill all mandatory fields marked with (*)</p>}
            <div className="flex items-start gap-5">
            
            <div>
            {/* Personal Info Section */}

            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Personal Information</h2>

                <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>FIRST NAME {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{useProfile.firstname}</p>}
                    {useEditing == true && <input required id="firstName" onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true)}; setProfile({ ...useProfile, firstname: e.target.value })}  } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={useProfile.firstname}/>}
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>LAST NAME {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{useProfile.lastname}</p>}
                    {useEditing == true && <input required onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true)}; setProfile({ ...useProfile, lastname: e.target.value })}  } onInvalid={()=>setValidInputs(false)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={useProfile.lastname}/>}
                </div>

                </div>

                <p style={{color: "#4d5055", fontSize: "12px"}}>DATE OF BIRTH {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "17px"}}>{str}</p>}
                {useEditing == true && <input required onInvalid={()=>setValidInputs(false)} type="date" onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true)}; setProfile({ ...useProfile, dateofbirth: e.target.value })}  } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={useProfile.dateofbirth}/>}

            </div>

            <div>
            {/*Contact Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Contact Information</h2>

            <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>AREA CODE {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom: "11px"}}>{phone.areaCode}</p>}
                    {useEditing == true && <input required onInvalid={()=>setValidInputs(false)} onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true); setPhone({ ...phone, areaCode: e.target.value }) }}} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={phone.areaCode}/>}
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>PHONE NUMBER {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{phone.number}</p>}
                    {useEditing == true && <input required onInvalid={()=>setValidInputs(false)} onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true); setPhone({ ...phone, number: e.target.value }) }}} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={phone.number}/>}
                </div>

            </div>
            <p style={{color: "#4d5055", fontSize: "12px"}}>EMAIL {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
            {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"266px", marginBottom: "17px"}}>{useProfile.email}</p>}
            {useEditing == true && <input required onInvalid={()=>setValidInputs(false)} type="email" onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true); setProfile({ ...useProfile, email: e.target.value })}  }} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"266px", marginBottom: "17px", resize:"none"}} defaultValue={useProfile.email}/>}
            </div>
            </div> {/*end of flex- gap-5 div*/}

            {/* Technical Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Technical Information</h2>

            <div className="flex items-start gap-4">

                <div>
                <p style={{color: "#4d5055", fontSize: "12px"}}>PROFESSION</p>
                {useEditing == false && <p style={{minHeight: "24px", borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{(useProfile.profession != null && useProfile.profession.trim() != "") ? useProfile.profession : " "}</p>}
                {useEditing == true && <input onChange={(e) => {setProfile({ ...useProfile, profession: e.target.value })} } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={(useProfile.profession != null) ? useProfile.profession : " "}/>}
                </div>

                <div>
                    {useSkills.length == 0 && <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", minHeight: "24px"}}>{(useProfile.skills != null) ? useProfile.skills : " "}</p>}
                    {useEditing == true && <input onChange={(e) => {setProfile({ ...useProfile, profession: e.target.value })} } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={(useProfile.skills!= null) ? useProfile.skills : " "}/>}
                    </div> }

                    {useSkills.length > 0 && <Skills props={useSkills} skills={useSkills} setSkills={setSkills}/>}
                </div>


            </div>

        </div>
        </div>
        </form>
        </UserContext.Provider>
    )
    
}

function Skills({skills, setSkills }: SkillProp){

    const editing = useContext(UserContext);

    const updateSkill = (index: number, newValue: string) => {
        setSkills((prev) => {
            const updated = [...prev]
            updated[index] = newValue
            return updated
        })
    }

    return(
    <div style={{marginBottom: editing? "24px" : ""}}>
        {skills.map((skill, index)=> 
            <div className="flex items-start gap-4" key={index}>

                {editing == false && <>
                <div>
                    {index == 0 && <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>}
                    {index == 0 && editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}}>{skill}</p>}
                    {index >= 2 &&  editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}}>{skills[index+1]}</p>}
                </div>

                <div>
                    {index+1 == 1 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {(index+1) != skills.length && (index+1) == 1 && editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+1]}</p>}
                    {(index+1) != skills.length && (index+1) > 1 && editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+2]}</p>}
                </div>

                <div>
                    {index+2 == 2 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {(index+2) != skills.length && (index+2) == 2 && editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+2]}</p>}
                    {(index+2) != skills.length && (index+2) > 2 && editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{skills[index+3]}</p>}
                </div>

                </>
                }

                {editing == true && <>
                <div>
                    {index == 0 && <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>}
                    {index == 0 && editing == true && <input onChange={(e) => updateSkill(index, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}} defaultValue= {skill}></input>}
                    {index >= 2 && editing == true && skills[index+1] && <input onChange={(e) => updateSkill(index+1, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}} defaultValue= {skills[index+1]}></input>}
                </div>

                <div>
                    {index+1 == 1 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {(index+1) != skills.length && (index+1) == 1 && skills[index+1] && editing == true && <input onChange={(e) => updateSkill(index+1, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}} defaultValue= {skills[index+1]}></input>}
                    {(index+1) != skills.length && (index+1) > 1 && skills[index+2] && editing == true && <input onChange={(e) => updateSkill(index+2, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}} defaultValue= {skills[index+2]}></input>}
                </div>

                <div>
                    {index+2 == 2 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {(index+2) != skills.length && (index+2) == 2 && skills[index+2] && editing == true && <input onChange={(e) => updateSkill(index+2, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}} defaultValue= {skills[index+2]}></input>}
                    {(index+2) != skills.length && (index+2) > 2 && skills[index+3] && editing == true && <input onChange={(e) => updateSkill(index+3, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}} defaultValue= {skills[index+3]}></input>}
                </div>
                
                </>
                }

                {index == skills.length-1 || index+1 == skills.length-1 && editing == true && <div>
                <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>
                <button style={{ textDecoration: "none", border: "1px solid #007BFF", paddingLeft: "8px", fontSize: "15px", color: "#4d5055", borderRadius: "4px", paddingRight: "7px"}}>Add Skill</button>
                </div>}

            </div>
    )}
    </div>
    )
}
