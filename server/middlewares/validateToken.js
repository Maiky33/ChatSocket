import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'

//funcion para validar si hay token
export const authRequired = (req,res,next) =>{   

    const cookieHeader = req.headers.cookie;

    if (cookieHeader) {
        const cookies = cookieHeader.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
        }, {});
        

        //Nos traemos el token de los headers que lo resivimos por req
        const {token} = cookies
        //Si no hay token negamos la entrada
        if(!token) res.status(401).json({message:"No token, authorization denied"})

        // si hay token verificamos el token, con el TOKEN_SECRET y hacemos un callback para enviar respuesta
        jwt.verify(token, TOKEN_SECRET, (err, user)=>{  
            //si hay algun error invalidamos el token 
            if(err) return res.status(403).json({message:"Invalid token"})

            //si todo sale bien devolvemos el usuario que tiene ese token, // a req para resivirlo en la funcion "profile"
            req.user = user
            
            next()
        })
    }
    

}