import User from "../models/user.js"
import bcrypt from 'bcryptjs'
import {CreateAccessToken} from '../libs/jwt.js' 

export const register = async(req, res)=>{   
  //req.body recibimos los datos que envia el user en frontend desde la peticion
  const {userName, email, password} = req.body

  try{    

    const userFound = await User.findOne({email})

    if(userFound) return res.status(400).json(["The email is already in use"])

    //encriptamos la password con bcrypt
    const passwordhash = await bcrypt.hash(password,10)
    //usamos el Schema para crear el nuevo objeto con los parametro nuevos
    const newUser = new User({  
      userName,
      email,
      password:passwordhash
    })

    //guardamos en base de datos
    const userSaved = await newUser.save()

    //creamos el token 
    const token = await CreateAccessToken({ 
      //le decimos el parametro que queremos guardar dentro del token
      id:userSaved._id
    })

    //lo guardamos en una cookie
    res.cookie("token", token);

    //devolvemos al frontend el user sin la password
    res.json({  
      id:userSaved._id,
      userName:userSaved.userName,
      email:userSaved.email,
      createAt:userSaved.createdAt,
      updatedAt:userSaved.updatedAt,
    })
  }catch(error){   
    res.status(500).json({message: error.message})
  }


  //respuesta que devolvemos
  res.send('registrando')
} 

export const login = async(req, res)=> { 
  //req.body recibimos los datos que envia el user en frontend desde la peticion
  const {email, password} = req.body

  try{    
    //buscamos el usuario con el email que nos pasaan por params 
    const UserFound = await User.findOne({email})

    //si no se encuentra el email repondemos con status
    if(!UserFound) return res.status(400).json({message:"User not found"})
    
    //comparamos la password que nos pasan por params con la password que esta guardada en la base de datos
    const isMatch = await bcrypt.compare(password,UserFound.password)

    //si no coinciden las contraseñas enviamos el status
    if(!isMatch) return res.status(400).json({message:"Incorrect Password"})

    
    //creamos el token 
    const token = await CreateAccessToken({ 
      //le decimos el parametro que queremos guardar dentro del token
      id:UserFound._id
    })

    //lo guardamos en una cookie
    res.cookie("token", token);

    //devolvemos al frontend el user sin la password
    res.json({  
      id:UserFound._id,
      userName:UserFound.userName,
      email:UserFound.email,
      createAt:UserFound.createdAt,
      updatedAt:UserFound.updatedAt,
    })
  }catch(error){   
    res.status(500).json({message: error.message})
  }


  //respuesta que devolvemos
  res.send('registrando')
}

export const logout = async(req, res)=>{
  res.cookie('token',"", {expires: new Date(0)})
  return res.sendStatus(200)
}

export const profile = async(req,res)=>{
  //con el req.user.id que resivimos de la verificacion del token, buscamos el objeto que tenga ese mismo ID en la base de datos(la coleccion users)
  const UserByToken = await User.findById(req.user.id)
  //si no existe el user retornamos un status
  if(!UserByToken) return res.status(400).json({message:"User not found"})

  // si existe un user retornamos el usuario
  return res.json({ 
    id:UserByToken._id,
    userName:UserByToken.userName,
    email:UserByToken.email,
    createAt:UserByToken.createdAt,
    updatedAt:UserByToken.updatedAt,
  })
}