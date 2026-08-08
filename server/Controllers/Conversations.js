import Conversation from '../models/Conversation.js';
import User from "../models/user.js"
import Message from "../models/message.js";

const save = async (req, res) => {

    try {

        // obtenemos el id del user del cliente
        const senderId = req.user.sub;
        //obtenemos el otro id del user de la conversacion 
        const { receiverId } = req.body;

        // si no existe retornamos una error
        if (!receiverId) {
            return res.status(400).json({
                status: 'error',
                message: 'Receiver id is required'
            });
        }

        // buscamos si ya existe una conversacion, con estos dos ids
        const conversationExists = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        // si existe, no guardamos y retornamos la conversacion que ya existe
        if (conversationExists) {
            return res.status(200).json({
                status: 'success',
                conversation: conversationExists
            });
        }

        // si no existe la conversacion la creamos con los parametro que tenemos
        const conversation = new Conversation({
            members: [senderId, receiverId]
        });

        // la guardamos en base de datos 
        const conversationSaved = await conversation.save();

        // y respondemos con la conversacion guardada
        return res.status(201).json({
            status: 'success',
            conversation: conversationSaved
        });

    } catch (error) {

        return res.status(500).json({
            status: 'error',
            message: error.message
        });

    }

};


const getConversations = async (req, res) => {

    try {

        const userId = req.user.sub;

        const conversations = await Conversation.find({
            members: userId
        }).sort({ updatedAt: -1 });


        const conversationsWithUser = await Promise.all(

            conversations.map(async (conversation) => {

                const otherUserId = conversation.members.find(
                    member => member.toString() !== userId
                );


                const user = await User.findById(otherUserId)
                    .select('email userName');


                const lastMessage = await Message.findOne({
                    conversationId: conversation._id
                })
                .sort({ createdAt: -1 });


                const unreadCount = await Message.countDocuments({
                    conversationId: conversation._id,
                    sender: { $ne: userId },
                    read: false
                });


                return {
                    _id: conversation._id,
                    user,
                    lastMessage,
                    unreadCount,
                    createdAt: conversation.createdAt,
                    updatedAt: conversation.updatedAt
                };

            })

        );


        return res.status(200).json({
            status: 'success',
            conversations: conversationsWithUser
        });


    } catch (error) {

        return res.status(500).json({
            status: 'error',
            message: error.message
        });

    }

};



const  markAsRead = async (req, res) => {

    try {

        const userId = req.user.sub;
        const { conversationId } = req.params;

        await Message.updateMany(
            {
                conversationId,
                sender: { $ne: userId },
                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Messages marked as read'
        });

    } catch (error) {

        return res.status(500).json({
            status: 'error',
            message: error.message
        });

    }
  
}

export default {
    save,
    getConversations,
    markAsRead
};