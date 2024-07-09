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
    console.log("password req.body",password)
    console.log("password UserFound.password",UserFound.password)

    const isMatch = await bcrypt.compare(password,UserFound.password)

    //si no coinciden las contraseñas enviamos el status
    if(!isMatch) return res.status(400).json({message:"Incorrect Password"})

    
    //creamos el token 
    const token = await CreateAccessToken({ 
      //le decimos el parametro que queremos guardar dentro del token
      id:UserFound._id
    })

    const cookieOptions = {
      httpOnly: true, // Solo accesible desde el servidor
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si está en producción
      maxAge: 24 * 60 * 60 * 1000 // 1 día de expiración
    };

    //lo guardamos en una cookie
    res.cookie("token", token, cookieOptions);

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
  res.send('logeado')
}

export const logout = async(req, res)=>{
  res.cookie('token','', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0) // Fecha de expiración en el pasado
  })
  return res.sendStatus(200)
}

export const relogin = async(req,res)=>{

  try {
    // El middleware authRequired verifica el token y añade el usuario al req.user
    const user = await User.findById(req.user.id);

    if (!user) return res.status(400).json({ message: "User not found" });

    // Genera un nuevo token de acceso
    const newToken = await CreateAccessToken({ id: user._id });

    const cookieOptions = {
      httpOnly: true, // Solo accesible desde el servidor
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si está en producción
      maxAge: 24 * 60 * 60 * 1000 // 1 día de expiración
    };

    // Guarda el nuevo token en una cookie
    res.cookie("token", newToken, cookieOptions);

    // Devuelve el usuario sin la contraseña
    res.json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      createAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}