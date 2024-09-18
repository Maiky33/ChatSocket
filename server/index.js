import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './routes/message.js'

import routerUsers from './routes/users.js'




//Configuracion mongoose
let url = `mongodb://atlas-sql-66d12a92d13577029747c09f-ljujc.a.query.mongodb.net/ChatSocket?ssl=true&authSource=admin`


//para poder evitar posibles fallos en la coneccion a mongodb
mongoose.Promise = global.Promise


//Express
const app = express()
const PORT = 4000

//SERVER MODULE HTTP

//creamos el server y se lo pasamos a sockect.io
const server = http.createServer(app) 
//configuaramos las cors para poder entrar desde cualquier servidor
const io = new SocketServer(server, {
    cors:{
        origin: 'https://chat-socket-client.vercel.app',
        credentials:true,
    }
})

app.use(cookieParser())
//middlewares
app.use(cors({
    origin: 'https://chat-socket-client.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
}));
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/// enrrutador de mensajes
app.use('/api', router)
/// enrrutador de usuarios
app.use('/api', routerUsers)

app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' https://chat-socket-server-nu.vercel.app;"
    );
    next();
});

// vemos la coneccion de los clientes io.on
io.on('connection', (socket) => {    

    console.log(socket.id)
    console.log('cliente conectado')

    //escuchamos el evento "message"(traemos los valosres message , nickname)
    socket.on('message', (message, nickname) => {  
        // emitimos los parametros que nos trae al resto de clientes conectados
        socket.broadcast.emit('message', {   
            body: message,
            from: nickname
        })
    })
})


//conneccion a la Db y ecuchamos la aplicacion atravez del puerto 4000
mongoose.connect(url, { useNewUrlParser: true }).then(() =>{  
    console.log('conectado a la base de datos')
    app.get('/', (req, res) => {
        res.send('Server is running');
    });
    server.listen(PORT, () => {    
        console.log('Server is running')
    })
});


