import { createContext, useState, useContext, useCallback} from "react";
import { getAllUsersRequest } from "../api/users";


export const UsersContext = createContext()


//
export const useUsers = ()=>{    
    const context = useContext(UsersContext)
    if(!context){   
        throw new Error("useMessage must be within a MessageProvider");
    }
    return context;
}


//creamos un contexto para poder usar esto valores desde cualquier componente en cual se engloba
export const UsersProvider = ({children})=>{    

    const [Errors, setErrors] = useState([])

    const getAllUsers =  useCallback(async()=>{  
        try{    
            const res = await getAllUsersRequest()

            if(res.status === 200){
                return res.data.Users
            }
        }catch(error){  
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }

    }, [])


    return( 
        <UsersContext.Provider   
            value={{
                getAllUsers,
                Errors
            }}>  
            {children}
        </UsersContext.Provider>
    )
}