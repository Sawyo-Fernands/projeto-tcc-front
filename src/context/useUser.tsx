import { ReactNode, createContext, useState } from "react";


interface UserContextProps{
    dataUser:dataUserType;
    setDataUser:(value:dataUserType) => void;
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

    return(
        <UserContext.Provider value={{dataUser,setDataUser}}>
            {children}
        </UserContext.Provider>
    )
}