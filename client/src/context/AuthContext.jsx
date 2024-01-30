import { createContext, useState, useContext} from "react";
import {registeRequest} from "../api/auth.js";

export const AuthContext = createContext()


//
export const useAuth = ()=>{    
    const context = useContext(AuthContext)
    if(!context){   
        throw new Error("useAuth mus be within an AuthProvider");
    }
    return context;
}


//creamos un contexto para poder usar esto valores desde cualquier componente en cual se engloba
export const AuthProvider = ({children})=>{    

    const [user, setUser] = useState(null)
    const [isAuthenticated, setisAuthenticated] = useState(false)
    const [Errors, setErrors] = useState([])

    const SingUp = async(values)=>{  
        try{    
            const res = await registeRequest(values)
            console.log(res.data)
            setisAuthenticated(true)
        }catch(error){   
            setErrors(error.response.data)
        }
    }

    return( 
        <AuthContext.Provider   
            value={{
                SingUp,
                user,
                isAuthenticated,
                Errors
            }}>  
            {children}
        </AuthContext.Provider>
    )
}