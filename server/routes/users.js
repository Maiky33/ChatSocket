import express from 'express'
import {login,register,logout,profile} from '../Controllers/users.js'
import {authRequired} from '../middlewares/validateToken.js'
const router = express.Router()

// escribimos las rutas que vamos a usar y le pasamos la funcion desde los controladores
//cuando se haga un peticion post a register se ejecuta "register"
router.post('/register',register)
//cuando se haga un peticion post a login se ejecuta "login"
router.post('/login',login)
//cuando se haga un peticion post a logout se ejecuta "logout"
router.post('/logout',logout)

//cuando se haga un peticion get a profile se ejecuta primero "authRequired" el cual nos ayuda a verificar si existe algiun token para pasar a, la segunda funcion "profile"
router.get('/profile',authRequired,profile)


//esportamos el enrutador para poder añadirlas en app
export default router