'use client'
import { ReactNode, createContext, useState } from "react";

interface UserContextProps{
    dataUser:dataUserType;
    setDataUser:(value:dataUserType) => void;
    openModalCapturaImagens:boolean;
    setOpenModalCapturaImagens:(value:boolean) => void;
}

export const UserContext = createContext({} as UserContextProps)


interface UserContextProviderProps {
    children:ReactNode;
}

type dataUserType = {
    id:number;
    usuario:string;
    email:string;
}

export function UserContextProvider({children}:UserContextProviderProps){

    const [dataUser,setDataUser] = useState<dataUserType>({
        email:"",
        id:0,
        usuario:''
    })
    const [openModalCapturaImagens, setOpenModalCapturaImagens] = useState(false);

    return(
        <UserContext.Provider value={{dataUser,setDataUser,openModalCapturaImagens,setOpenModalCapturaImagens}}>
            {children}
        </UserContext.Provider>
    )
}