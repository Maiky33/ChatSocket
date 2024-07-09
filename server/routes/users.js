import express from 'express'
import {login,register,logout,relogin} from '../Controllers/users.js'
import {authRequired} from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import { registerSchema,loginSchema } from "../schemas/auth.schema.js";
const router = express.Router()

// escribimos las rutas que vamos a usar y le pasamos la funcion desde los controladores
//cuando se haga un peticion post a register se ejecuta "register"
router.post('/register',validateSchema(registerSchema),register)
//cuando se haga un peticion post a login se ejecuta "login"
router.post('/login',validateSchema(loginSchema),login)
//cuando se haga un peticion post a logout se ejecuta "logout"
router.post('/logout',logout)

//cuando se haga un peticion get a profile se ejecuta primero "authRequired" el cual nos ayuda a verificar si existe algiun token para pasar a, la segunda funcion "profile"
router.get('/relogin',authRequired,relogin)


//esportamos el enrutador para poder añadirlas en app
export default router