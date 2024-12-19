import mongoose from 'mongoose';
import User from './userModel.js'
import Post from './postModel.js'

const commentSchema = new mongoose.Schema({
    // _id: { type: Number, required: true, auto: true  },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },

    // userId: { type: Number, ref: 'User', required: true },
    // postId: { type: Number, ref: 'Post', required: true },
    userId: {  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: {  type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    comment: { type: String, trim: true, required: true,  },
    date: { type: Date, required: true, default: Date.now, immutable: true, }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
