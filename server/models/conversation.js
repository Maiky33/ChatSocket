import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({

    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }]

}, {
    timestamps: true
});

export default mongoose.model('conversation', ConversationSchema);