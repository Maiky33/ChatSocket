import io from "socket.io-client";
import { createContext, useState, useContext, useCallback, useEffect} from "react";
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
    const [loading, setLoading] = useState(true);
    const [Errors, setErrors] = useState([])

    const API = process.env.REACT_APP_API_URL
    const Socket = io(API,{withCredentials: true});

    useEffect(() => {

        if (isAuthenticated && user) {
            Socket.emit("userConnected", {
                id: user.id,
                userName: user.userName
            });
        }

    }, [isAuthenticated, user, Socket]);

    const SingUp = async(values)=>{  
        try{    
            const res = await registerRequest(values)
            setUser(res?.data)
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
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }
    }

    const LogOut = async()=>{
        try{    
            await logOutRequest()
            Socket.disconnect();
            setUser(null)
            setisAuthenticated(false)
        }catch(error){   
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }
    }

    const reloginverifyToken = useCallback(async () => {

        try {

            const res = await reloginverifyTokenRequest();

            if (res.status === 200) {
                setUser(res.data);
                setisAuthenticated(true);
            }

            return res;

        } catch (error) {

            if (Array.isArray(error?.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error?.response?.data?.message]);
            }

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ 
        reloginverifyToken()
    },[reloginverifyToken])

    return( 
        <AuthContext.Provider   
            value={{
                SingUp,
                SingIn,
                user,
                LogOut,
                isAuthenticated,
                reloginverifyToken,
                Errors,
                loading,
                Socket
            }}>  
            {children}
        </AuthContext.Provider>
    )
}