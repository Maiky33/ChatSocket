import express from 'express'
import Controller from '../Controllers/Message.js'
import {authRequired} from '../middlewares/authRequired.js'

const router = express.Router()


//definimos las rutas de la aplicacion, y le pasamos la funcion de controllers

router.post('/messages', authRequired, Controller.save);
router.get('/messages/:conversationId', authRequired, Controller.getMessages);


export default router