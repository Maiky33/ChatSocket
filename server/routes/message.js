import express from 'express'
import Controller from '../Controllers/message.js'
import {authRequired} from '../middlewares/validateToken.js'

const router = express.Router()


//definimos las rutas de la aplicacion, y le pasamos la funcion de controllers

router.post('/save', authRequired,Controller.save)
router.get('/messages', authRequired,Controller.getMessages)


export default router