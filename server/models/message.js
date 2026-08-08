import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({

    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'conversation',
        required: true
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    read: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

export default mongoose.model('messages', MessageSchema);