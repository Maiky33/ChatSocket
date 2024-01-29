import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import router from './routes/message.js'



//Configuracion mongoose
let url = 'mongodb+srv://maicol:maicol997608@kuepa.qq1uoxh.mongodb.net/?retryWrites=true&w=majority'

//para poder evitar posibles fallos en la coneccion a mongodb
mongoose.Promise = global.Promise


//Express
const app = express()
const PORT = 4000

//SERVER MODULE HTTP

//creamos el server y se lo pasamos a sockect.io
const server = http.createServer(app) 
const io = new SocketServer(server, {
    cors:{
        origin: '*'
    }
})

//middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', router)


io.on('connection', (socket) => {    
    console.log(socket.id)
    console.log('cliente conectado')

    socket.on('message', (message, nickname) => {  
        //envio al resto de clientes conectados
        socket.broadcast.emit('message', {   
            body: message,
            from: nickname
        })
    })
})

//conneccion a la Db y ecuchamos la aplicacion atravez del puerto 4000
mongoose.connect(url, { useNewUrlParser: true }).then(() =>{  
    console.log('conectado a la base de datos')
    server.listen(PORT, () => {    
        console.log('servidor ejecutandose en http://localhost:', PORT)
    })
});
