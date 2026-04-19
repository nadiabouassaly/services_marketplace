"use client"

import { Profile, UserService } from "@/types/userService"
import { useContext, useState, createContext, useRef} from "react";
import Image from "next/image";
import updateProfile from "@/lib/profile";
import { z } from "zod";
import Card from "./Card";
import { getNumberOfServicesById} from "@/lib/services";
import { supabase } from "@/app/auth/lib/supabase";

const UserContext = createContext(false) ;

type InfoProp = {
    prop: Profile
    logedInUser: boolean
    services: UserService[]
}

type SkillProp = {
    props: string[]
    skillsArray: string[]
    setSkillsArray: React.Dispatch<React.SetStateAction<string[]>>
};

export default function InfoComponent(profile: InfoProp){

    const [useEditing, setEditing] = useState(false) ;
    const [useValidInputs, setValidInputs] = useState(true) ;
    const [useSaving, setSaving] = useState(false);
    const [useProfile, setProfile] = useState(profile.prop)
    const [error, setError] = useState<z.ZodError | null>(null);

    const date = new Date(useProfile.dateofbirth) ;
    const str = date.toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric"});

    const phoneNumber = useProfile.phoneNumber;
    const index = phoneNumber.indexOf(" ")
    const areaCode = phoneNumber.substring(0, index);
    const number = phoneNumber.substring(index+1);
    
    const today = new Date() ;
    const age = today.getFullYear() - date.getFullYear() ;

    const [phone, setPhone] = useState({
    areaCode: areaCode,
    number: number
    })

    const [useSkills, setSkills] = useState(useProfile.skills || []);

    const services = profile.services ;

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

    const addButton ={
        position: "absolute" as const,
        top: 6,
        right: 4,
        width: 28,
        height: 28,
        borderRadius: "50%",
        fontSize: "20px",
        lineHeight: "26px", 
        textAlign: "center" as const,
        background: "white",
        cursor: "pointer",
        padding: 0,
        color:"#007BFF"
    };

    // for validating the input fields 
    const lettersOnly = /^[A-Za-z\s]+$/;

    const userSchema = z.object({
    firstname: z.string()
    .trim()
    .min(2, "Please fill all fields marked with (*)")
    .regex(lettersOnly, "Please enter a valid name."),

    lastname: z.string()
    .trim()
    .min(2, "Please fill all fields marked with (*)")
    .regex(lettersOnly, "Please enter a valid name."),

    phoneNumber: z.string()
    .min(7, "Please enter a valid phone number.")
    .regex(/^\d+$/, "Please enter a valid phone number."),

    areaCode: z.string()
    .min(1, "Please enter a valid area code.")
    .regex(/^\+?\d+$/, "Please enter a valid area code."),
    email: z.string()
    .min(1, "Please fill all fields marked with (*)")
    .email("Please enter a valid email address."),

    skills: z.array(
    z.string()
    .trim()
    .min(2, "Too short")
    .regex(lettersOnly, "Only letters allowed")
    ),

    profession: z.string()
    .trim()
    .min(2,"Please fill all fields marked with (*)")
    .regex(lettersOnly, "Please enter a valid profession.")
    .optional()
    .or(z.literal("")),

    dateofbirth: z.string()
    .min(1, "Please fill all fields marked with (*)")
    .refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    return dob <= today;
    }, "Date of birth cannot be in the future.")
    .refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    return actualAge >= 14;
    }, "You must be at least 14 years old."),
    });

    const onSave=(e: React.FormEvent<HTMLFormElement>)=>{

        e.preventDefault();
        setSaving(true);

        const result = userSchema.safeParse(tempProfile);

        if(result.success){
        setValidInputs(true);
        setEditing(false);
        handleSave() ;
        
        checkForDeletedServices() ;
        }

        else {
        setError(result.error);
        setValidInputs(false);
        }
    }

    const checkForDeletedServices = async () =>{
        const temp = await getNumberOfServicesById(profile.prop.userprofile_id)

        if(temp != profile.services.length)
        window.location.reload()
    };

    
    const fullPhone = phone.areaCode + " " + phone.number
    const filteredSkills = useSkills.filter(skill => skill.trim() !== "") 

    const updatedProfile = {
         ...useProfile,
        phoneNumber: fullPhone,
        skills: filteredSkills
    }

    const tempProfile={
        ...useProfile,
        areaCode: phone.areaCode,
        phoneNumber: phone.number,
        skills: filteredSkills

    }
    const handleSave = async () => {

        const error  = await updateProfile(profile.prop.userprofile_id, updatedProfile)
    
        setProfile(updatedProfile)
        setSkills(filteredSkills) // update local state too so display is clean
    }

    const firstError = error
    ? (Object.values(error.flatten().fieldErrors).flat()[0] as string)
    : null;

    //Upload Profile Picture from the user
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.log(file) // do whatever you need with the file
    }

    const signOut = async ()=>{
        
        const confirmed = window.confirm("Are you sure you want to sign out?") ;

        if(confirmed){
        await supabase.auth.signOut();
        window.location.reload()
        }
    }

    return(
            <UserContext.Provider value={useEditing}>
            <>

            <form onSubmit={onSave} noValidate>
            <div className="flex items-start gap-4">
            <div style={{width: "275px"}}>
            
            <div style={{paddingLeft: "70px"}}>

            <div style={{position:"relative", width:"120px", height:"127px"}}>
            <Image src={useProfile.profilePicture || "/profileIcon.jpg"} alt="Default Profile Image" className = "rounded-full object-cover border-2 border-[#007bffeb] shadow-[0_0_5px_#B0BEC5] mt-1" width={120} height={120}/>
            {useEditing == true && <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*"/>}
            {useEditing == true && <button type="button"style={addButton} className="border-1 border-gray-350 shadow-[0_0_5px_#B0BEC5]" onClick={() => fileInputRef.current?.click()}>+</button>}
            </div>

            {useEditing != true && profile.logedInUser && <button style={buttonStyle} onClick={()=>setEditing(true)}>Edit Profile</button>}
            {useEditing == true && <button type = "submit" style={buttonStyle2} >Save changes</button>}
            </div>

            </div>  
            
            {/* <div style={{ display: "flex", flexDirection: "column"}}> */}
            <div style={{ width: "980px", margin: "0 auto" }}>

            {/* <div style={{display: "flex", justifyContent: "space-between", alignItems: "center" }}> */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

            <h1 className = "text-4xl font-bold mb-4.5" style={{color: "#1460b1"}}>{profile.logedInUser? "My Profile": "Profile"}</h1> 
            {profile.logedInUser && <button type="button"  style={{marginRight:"40px", marginBottom:"1px", color:"red", fontSize:"16.5px"}} onClick={()=>signOut()}>Sign out</button>}
            </div>


            {useValidInputs == false && useSaving == true && <p style={{marginTop:"-7px", marginBottom:"5px", fontSize:"15px", color:"red"}}>{firstError}</p>}
            <div className="flex items-start gap-5">
            
            <div>
            {/* Personal Info Section */}

            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Personal Information</h2>

                <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>FIRST NAME {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{useProfile.firstname}</p>}
                    {useEditing == true && <input name="firstName" required id="firstName" onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true)}; setProfile({ ...useProfile, firstname: e.target.value })}  } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={useProfile.firstname}/>}
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>LAST NAME {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{useProfile.lastname}</p>}
                    {useEditing == true && <input name="lastName" required onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true)}; setProfile({ ...useProfile, lastname: e.target.value })}  } onInvalid={()=>setValidInputs(false)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={useProfile.lastname}/>}
                </div>

                {profile.logedInUser == false && <div>
                <p style={{color: "#4d5055", fontSize: "12px"}}>AGE</p>
                <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "17px"}}>{age}</p>
                </div>}

                </div>

                {profile.logedInUser && <p style={{color: "#4d5055", fontSize: "12px"}}>DATE OF BIRTH{useEditing == true && <span style={{color: "red"}}>*</span>} </p>}
                {useEditing == false && profile.logedInUser && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "17px"}}>{profile.logedInUser? str: age}</p>}
                {useEditing == true && <input name="dateOfBirth" required onInvalid={()=>setValidInputs(false)} type="date" onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true)}; setProfile({ ...useProfile, dateofbirth: e.target.value })}  } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={useProfile.dateofbirth}/>}

            </div>

            { profile.logedInUser && <div>
            {/*Contact Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Contact Information</h2>

            <div className="flex items-start gap-4">

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>AREA CODE {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom: "11px"}}>{phone.areaCode}</p>}
                    {useEditing == true && <input name="areaCode" required onInvalid={()=>setValidInputs(false)} onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true); setPhone({ ...phone, areaCode: e.target.value }) }}} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={phone.areaCode}/>}
                </div>

                <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>PHONE NUMBER {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "11px"}}>{phone.number}</p>}
                    {useEditing == true && <input name="phoneNumber" required onInvalid={()=>setValidInputs(false)} onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true); setPhone({ ...phone, number: e.target.value }) }}} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={phone.number}/>}
                </div>

            </div>
            <p style={{color: "#4d5055", fontSize: "12px"}}>EMAIL {useEditing == true && <span style={{color: "red"}}>*</span>} </p>
            {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"266px", marginBottom: "17px"}}>{useProfile.email}</p>}
            {useEditing == true && <input name="email" required onInvalid={()=>setValidInputs(false)} type="email" onChange={(e) => {if (e.currentTarget.validity.valid){setValidInputs(true); setProfile({ ...useProfile, email: e.target.value })}  }} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"266px", marginBottom: "17px", resize:"none"}} defaultValue={useProfile.email}/>}
            </div>
            }
            </div>  {/*end of flex- gap-5 div*/}

            {/* Technical Info Section */}
            <h2 className="font-bold mb-0.5" style={{fontSize: "19px"}}>Technical Information</h2>

            <div className="flex items-start gap-4">

                <div>
                <p style={{color: "#4d5055", fontSize: "12px"}}>PROFESSION</p>
                {useEditing == false && <p style={{minHeight: "24px", borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px"}}>{(useProfile.profession != null && useProfile.profession.trim() != "") ? useProfile.profession : " "}</p>}
                {useEditing == true && <input name="profession" onChange={(e) => {setProfile({ ...useProfile, profession: e.target.value })} } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={(useProfile.profession != null) ? useProfile.profession : " "}/>}
                </div>

                <div>
                    {useSkills.length == 0 && <div>
                    <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>
                    {useEditing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", minHeight: "24px"}}>{(useProfile.skills != null) ? useProfile.skills : " "}</p>}
                    {useEditing == true && <input name="skills" onChange={(e) => {setProfile({ ...useProfile, profession: e.target.value })} } style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width:"125px", marginBottom: "11px", resize:"none"}} defaultValue={(useProfile.skills!= null) ? useProfile.skills : " "}/>}
                    </div> }

                    {useSkills.length > 0 && <Skills props={useSkills} skillsArray={useSkills} setSkillsArray={setSkills}/>}
                </div>


            </div>

        </div>
        </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[900px] ml-4 mt-3">
            {services.map((card) => (
            <Card
                key={card.services_id}
                id={card.services_id.toString()}
                name={card.name}
                price={card.price}
                description={card.description}
                category={card.category}
                editing={useEditing}
            />
            ))}
        </div>

        </>
        </UserContext.Provider>
    )
    
}

function Skills({skillsArray, setSkillsArray }: SkillProp){

    const editing = useContext(UserContext);
    const skills = skillsArray ;

    const displayedSkills = editing ? skills : skills.filter(skill => skill.trim() !== "");

    const updateSkill = (index: number, newValue: string) => {
        setSkillsArray((prev) => {
            const updated = [...prev]
            updated[index] = newValue
            return updated
        })
    }

    const onClick = ()=>{
        setSkillsArray((prev) => [...prev, ""]);
    }

    return(
    <div style={{marginBottom: editing? "24px" : ""}}>
        {displayedSkills.map((skill, index)=> 
            index % 3 == 0 && <div className="flex items-start gap-4" key={index}>

                {editing == false && <>
                <div>
                    {index == 0 && <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>}
                    {displayedSkills[index] !== undefined && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}}>{displayedSkills[index]}</p>}
                </div>

                <div>
                    {index+1 == 1 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {displayedSkills[index + 1] !== undefined && editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{displayedSkills[index+1]}</p>}
                </div>

                <div>
                    {index+2 == 2 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {displayedSkills[index + 2] !== undefined  && editing == false && <p style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}}>{displayedSkills[index+2]}</p>}
                </div>

                </>
                }

                {editing == true && <>
                <div>
                    {index == 0 && <p style={{color: "#4d5055", fontSize: "12px"}}>SKILLS</p>}
                    {displayedSkills[index] !== undefined && <input onChange={(e) => updateSkill(index, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "9px", width:"125px", marginBottom:"12px"}} value= {displayedSkills[index]}></input>}
                
                </div>

                <div>
                    {index+1 == 1 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {displayedSkills[index+1] !== undefined && displayedSkills[index+1] != undefined && <input onChange={(e) => updateSkill(index+1, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}} value= {displayedSkills[index+1]}></input>}                
                </div>

                <div>
                    {index+2 == 2 && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                    {displayedSkills[index+2] != undefined && <input onChange={(e) => updateSkill(index+2, e.target.value)} style={{borderStyle: "solid", backgroundColor: "#c6e1fe80", paddingLeft: "7px", width: "125px", marginBottom: "12px"}} value= {displayedSkills[index+2]}></input>}
                    
                </div>
                
                {editing && index + 3 >= displayedSkills.length && <div>
                {displayedSkills.length <=3  && <p style={{color: "#4d5055", fontSize: "12px", visibility: "hidden"}}>S</p>}
                <button type="button" onClick={onClick} style={{ textDecoration: "none", border: "1px solid #007BFF", paddingLeft: "8px", fontSize: "15px", color: "#4d5055", borderRadius: "4px", paddingRight: "7px"}}>Add Skill</button>
                </div>
                }

                </>
                }

            </div>
    )}
    

    </div>
    )
}
