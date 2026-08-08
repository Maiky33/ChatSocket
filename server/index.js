import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import routerMessage from './routes/Message.js'
import routerAuth from './routes/Auth.js'
import routerUsers from './routes/Users.js'
import routerConversations from './routes/Conversations.js'

import Conversation from './models/conversation.js';

import dotenv from "dotenv";
dotenv.config();




//Configuracion mongoose
// let url = "mongodb://127.0.0.1:27017/chat-Socket"
let url = process.env.URL_DATABASE
let clientUrl = process.env.URL_CLIENT || "http://localhost:3000"


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
        origin: clientUrl,
        credentials:true
    }
})

app.use(cors({
    origin: clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(cookieParser())
//middlewares
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.on('finish', () => {
      console.log('initial Response Headers:', res.getHeaders());
    });
    next();
});

/// enrrutador de autentificacion
app.use('/api', routerAuth)
/// enrrutador de usuarios
app.use('/api', routerUsers)
/// enrrutador de mensajes
app.use('/api', routerMessage)
// enrrutador de conversaciones
app.use('/api', routerConversations)



const onlineUsers = new Map();

// vemos la coneccion de los clientes io.on
io.on('connection', (socket) => {

    socket.on("userConnected", (user) => {

        socket.userId = user.id;

        onlineUsers.set(user.id, socket.id);

        io.emit("onlineUsers", [...onlineUsers.keys()]);
    });


    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
    });


    socket.on("message", async (message) => {

        try {

            // Buscamos la conversación
            const conversation = await Conversation.findById(
                message.conversationId
            );

            if (!conversation) return;

            // Enviamos el mensaje a quienes tienen abierta la conversación
            io.to(message.conversationId).emit("message", message);

            // Buscamos los miembros de la conversación
            conversation.members.forEach((memberId) => {

                const memberSocketId = onlineUsers.get(
                    memberId.toString()
                );

                if (memberSocketId) {

                    io.to(memberSocketId).emit(
                        "conversationUpdated",
                        message
                    );

                }

            });

        } catch (error) {

            console.error("Error sending conversation update:", error);

        }

    });


    socket.on("disconnect", () => {

        for (const [userId, socketId] of onlineUsers) {

            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }

        }

        io.emit("onlineUsers", [...onlineUsers.keys()]);
    });

});


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


