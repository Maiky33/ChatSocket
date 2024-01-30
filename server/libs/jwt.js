import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'
//funcion que genera el token
export const CreateAccessToken =(Payload)=>{  
  //devolvemos y usamos new promise cuando ejecutamos el resolved todo fue bien, cuando se ejecuta el reject todo salio mal
  return new Promise((resolved, reject)=>{   
    //generamos el token 
    jwt.sign(
      //le decimos el parametro que queremos guardar dentro del token
      Payload,
      //string para poder cifrar o desifrar el contenido del token
      TOKEN_SECRET
      ,{  
        //aca van las opciones de cuanto tiempo quiero que dure etc
        expiresIn:"1d"
      },
      (err,token)=>{  
        if(err) reject(err);
        resolved(token)
        //creamos la cookie para guardar el token
      }
    )
  })
}
