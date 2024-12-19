import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// import Counter from './counterModel.js';

const userSchema = new mongoose.Schema({
    // _id: { type: Number, required: true, auto: true  },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    role: { type: String, default: 'user' },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, unique: true, required: [true, 'Please enter email'], lowercase: true, trim: true },
    password: { type: String, required: [true, 'Please enter password'], minlength: [8, 'password must be at least 8 character'], select: false},
    address: { type: String, required: [true, 'Please enter a valid address'], trim: true },
    date: { type: Date, required: true, default: Date.now, immutable: true, },
    verifiedEmail: { type: Boolean, required: true, default: false },
    city: { type: String }
});


// userSchema.pre('save', async function (next) {
//     // to auto genertate _id fiel for _id type number
//     if (this.isNew) {
//         try {
//             const counter = await Counter.findByIdAndUpdate(
//                 { _id: 'userId' },
//                 { $inc: { sequence_value: 1 } },
//                 { new: true, upsert: true }
//             );
//             this._id = counter.sequence_value;
//         } catch (err) {
//             return next(err);
//         }
//     }
//     next();
// })

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});



userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model('User', userSchema);

export default User;
