import User from "../models/user.js"

export const register = async(req, res)=>{   
  //req.body recibimos los datos que envia el user en frontend desde la peticion
  const {userName, email, password} = req.body

  try{    
    //usamos el Schema para crear el nuevo objeto con los parametro nuevos
    const newUser = new User({  
        userName,
        email,
        password
    })

    //guardamos en base de datos
    await newUser.save()
    res.send("registrando")
  }catch(error){   
    console.log(error)
  }


  //respuesta que devolvemos
  res.send('registrando')
} 

export const login = (req, res)=> res.send("login")