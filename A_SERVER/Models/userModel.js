import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
// import Counter from './counterModel.js';

const userSchema = new mongoose.Schema({
    // _id: { type: Number },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    role: { type: String, default: 'user' },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, unique: true, required: [true, 'Please enter email'], lowercase: true, trim: true },
    password: { type: String, required: [true, 'Please enter password'], minlength: [8, 'password must be at least 8 character'], select: false},
    address: { type: String, required: [true, 'Please enter a valid address'], trim: true },
    date: { type: Date, required: true, default: Date.now, immutable: true, },
    city: { type: String },

    verifiedEmail: { type: Boolean, required: true, default: false },
    passwordResetToken: { type: String },
    passwordResetTokenExp: Date,
    passwordChangedAt: { type: Date, default: Date.now, trim: true },
    emailVerificationToken: String,
    emailVerificationTokenExp: Date,
});


// userSchema.pre('save', async function (next) {
//     // to auto genertate _id fiel for _id type number
//     if (this.isNew) {
//         try {
//             const counter = await Counter.findByIdAndUpdate(
//                 { _id: 'userid' },
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

// // Mongoose instance method to create a reset password token
// // read createResetPasswordToken.docx
// userSchema.methods.createResetPasswordToken = function () {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetTokenExp = Date.now() + 10 * 60 * 1000;
//     return resetToken;
// };

userSchema.methods.createResetPasswordToken = function () {
    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    // Hash the token to store securely in the database
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
    // Set expiration time (10 minutes)
    this.passwordResetTokenExp = Date.now() + 10 * 60 * 1000;
  
    // Return the plain token to send in the reset password email
    return resetToken;
  };
  
// // Mongoose instance method to create an email verification token
// // This method is smilar to createResetPasswordToken
// userSchema.methods.createEmailVerificationToken = function () {
//     const verifyToken = crypto.randomBytes(25).toString('hex') + ' ' + this.email;
//     this.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
//     this.emailVerificationTokenExp = Date.now() + 10 * 60 * 1000;
//     return verifyToken;
// };

userSchema.methods.createEmailVerificationToken = function () {
    if (!this.email) {
      throw new Error('Email is required to create verification token');
    }
  
    // Generate a random token
    const verifyToken = crypto.randomBytes(25).toString('hex') + ' ' + this.email;
  
    // Hash the token to store securely
    this.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  
    // Set expiration time (10 minutes)
    this.emailVerificationTokenExp = Date.now() + 10 * 60 * 1000;
  
    // Return the plain token to send in email (non-hashed version)
    return verifyToken;
  };

const User = mongoose.model('User', userSchema);

export default User;
