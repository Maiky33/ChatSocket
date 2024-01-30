import express from 'express'
import {login,register} from '../Controllers/users.js'

const router = express.Router()

// escribimos las rutas que vamos a usar y le pasamos la funcion desde los controladores
//cuando se haga un peticion post a register se ejecuta "register"
router.post('/register',register)
//cuando se haga un peticion post a login se ejecuta "login"
router.post('/login',login)


//esportamos el enrutador para poder añadirlas en app
export default router