import { createContext, useState, useContext, useEffect} from "react";
import {registeRequest,loginRequest,findUser} from "../api/auth.js";

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
            setUser(res.data)
            setisAuthenticated(true)
        }catch(error){   
            
            setErrors(error.response.data)
        }
    }

    const SingIn = async(values)=>{
        try{    
            const res = await loginRequest(values)
            setUser(res.data)
            setisAuthenticated(true)
        }catch(error){   
            if(Array.isArray(error.response.data)){ 
                return setErrors(error.response.data)
            }
            setErrors([error.response.data.message])
        }
    }

    return( 
        <AuthContext.Provider   
            value={{
                SingUp,
                SingIn,
                user,
                isAuthenticated,
                Errors
            }}>  
            {children}
        </AuthContext.Provider>
    )
}