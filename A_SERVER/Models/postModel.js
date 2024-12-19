// Models\postModel.js
import mongoose from 'mongoose';
// import User from './userModel.js'



const postSchema = new mongoose.Schema({
    // _id: { type: Number, required: true, auto: true  },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },

    // userId: { type: Number, ref: 'User', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    files: {
        type: [Object], // Assuming you want an array of objects
        // required: true
    },
    // title: { type: String, required: true },
    likes: { type: Number, default:0 },
    comments: { type: Number, default:0 },
    content: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now, immutable: true, }
});

const Post = mongoose.model('Post', postSchema)

export default Post;
