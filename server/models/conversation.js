import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({

    members: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }],

    lastMessage: {
        text: {
            type: String,
            default: ""
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        createdAt: {
            type: Date
        }
    }

}, {
    timestamps: true
});

export default mongoose.model('conversation', ConversationSchema);