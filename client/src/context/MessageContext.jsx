import { createContext, useState, useContext, useCallback} from "react";
import {getMessagesRequest, saveMessageRequest} from "../api/messages";


export const MessageContext = createContext()


//
export const useMessage = ()=>{    
    const context = useContext(MessageContext)
    if(!context){   
        throw new Error("useMessage must be within a MessageProvider");
    }
    return context;
}


//creamos un contexto para poder usar esto valores desde cualquier componente en cual se engloba
export const MessageProvider = ({children})=>{    

    const [Errors, setErrors] = useState([])

    const getMessages =  useCallback(async()=>{  
        try{    
            const res = await getMessagesRequest()
            if(res.status === 200){
                return res.data.messages
            }
        }catch(error){  
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }

    }, [])

    const saveMessage = async(message)=>{   
        try{    
            const res = await saveMessageRequest(message)
            if(res.status === 200){
                return res.data
            }
        }catch(error){  
            if(Array.isArray(error?.response?.data)){ 
                return setErrors(error?.response?.data)
            }
            setErrors([error?.response?.data?.message])
        }
    } 

    return( 
        <MessageContext.Provider   
            value={{
                getMessages,
                saveMessage,
                Errors
            }}>  
            {children}
        </MessageContext.Provider>
    )
}