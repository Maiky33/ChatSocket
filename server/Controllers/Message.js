import Message from '../models/Message.js';

const Controller = {

  save: async (req, res) => {

    try {

        const { conversationId, message } = req.body;

        const sender = req.user.sub;

        if (!conversationId || !message) {
            return res.status(400).json({
                message: 'Conversation and message are required'
            });
        }

        const newMessage = await Message.create({
            conversationId,
            sender,
            message
        });

        return res.status(201).json(newMessage);

    } catch (error) {

        return res.status(500).json({
            status: 'error',
            message: error.message
        });

    }

  },

  getMessages: async (req, res) => {

    try {

        const { conversationId } = req.params;

        const messages = await Message.find({
            conversationId
        })
        .populate('sender', 'userName email')
        .sort({ createdAt: 1 });

        return res.status(200).json(messages);

    } catch (error) {

        return res.status(500).json({
            status: 'error',
            message: error.message
        });

    }

  }
};

export default Controller;