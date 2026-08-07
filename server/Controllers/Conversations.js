import Conversation from '../models/Conversation.js';
import User from "../models/user.js"

const save = async (req, res) => {

    try {

        const senderId = req.user.id;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                status: 'error',
                message: 'Receiver id is required'
            });
        }

        const conversationExists = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (conversationExists) {
            return res.status(200).json({
                status: 'success',
                conversation: conversationExists
            });
        }

        const conversation = new Conversation({
            members: [senderId, receiverId]
        });

        const conversationSaved = await conversation.save();

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

        const userId = req.user.id;

        const conversations = await Conversation.find({
            members: userId
        }).sort({ updatedAt: -1 });

        const conversationsWithUser = await Promise.all(

            conversations.map(async (conversation) => {

                const otherUserId = conversation.members.find(
                    member => member.toString() !== userId
                );

                const user = await User.findById(otherUserId)
                    .select('name email image');

                return {
                    _id: conversation._id,
                    user,
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

export default {
    save,
    getConversations
};