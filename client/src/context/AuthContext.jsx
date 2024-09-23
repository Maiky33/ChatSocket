import { createContext, useState, useContext, useCallback} from "react";
import {registerRequest,loginRequest,logOutRequest,reloginverifyTokenRequest} from "../api/auth.js";
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
            const res = await registerRequest(values)
            if (res.data.token) {
                localStorage.setItem('token', response.data.token); // Guarda el token en localStorage
            }
            setUser(res.data)
            setisAuthenticated(true)
        }catch(error){   
            
            setErrors(error.response.data)
        }
    }

    const SingIn = async(values)=>{
        try{    
            const res = await loginRequest(values)
            if (res.data.token) {
                localStorage.setItem('token', response.data.token); // Guarda el token en localStorage
            }
            setUser(res.data)
            setisAuthenticated(true)
        }catch(error){   
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }
    }

    const LogOut = async()=>{
        try{    
            const res = await logOutRequest()
            localStorage.removeItem('token'); // Elimina el token del almacenamiento local al cerrar sesión
            setUser(res.data)
            setisAuthenticated(false)
        }catch(error){   
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }
    }

    const reloginverifyToken = useCallback(() => {   
        try{    
            const res = reloginverifyTokenRequest()
            if(res.status === 200){    
                if (res.data.newToken) {
                    localStorage.setItem('token', response.data.newToken); // Guarda el token en localStorage
                }
                setUser(res.data)
                setisAuthenticated(true)
            }
            return res
        }catch(error){   
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }
    }, []);

    return( 
        <AuthContext.Provider   
            value={{
                SingUp,
                SingIn,
                user,
                LogOut,
                isAuthenticated,
                reloginverifyToken,
                Errors
            }}>  
            {children}
        </AuthContext.Provider>
    )
}