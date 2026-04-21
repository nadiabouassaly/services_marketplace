"use client"

import { useContext } from "react";
import {UserContext} from "./AuthModal"

export default function IsVisitor(){
    const visitor = useContext(UserContext)

    return visitor ;
}

