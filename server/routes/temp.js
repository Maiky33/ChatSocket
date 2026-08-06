import express from 'express'
import Controller from '../Controllers/Users.js'


const router = express.Router()

// escribimos las rutas que vamos a usar y le pasamos la funcion desde los controladores
//cuando se haga un peticion post a register se ejecuta "register"
router.get('/getAllUsers', Controller.getMessages)


//esportamos el enrutador para poder añadirlas en app
export default router