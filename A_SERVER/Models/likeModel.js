import mongoose from 'mongoose';
import User from './userModel.js';
import Post from './postModel.js';

const likeSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    likestring: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now, immutable: true }
});

// // Pre-save hook to set likestring as concatenation of postId and userId
// likeSchema.pre('save', function (next) {
//     if (this.isNew || this.isModified('postId') || this.isModified('userId')) {
//         this.likestring = `${this.postId.toString()}${this.userId.toString()}`;
//     }
//     next();
// });

const Like = mongoose.model('Like', likeSchema);

export default Like;
