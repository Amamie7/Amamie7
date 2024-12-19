import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
import protect from '../Middlewares/authMiddleware.js';
import Restrict from '../Middlewares/restrict.js'
import sendEmail from "../Utils/email.js";
import crypto from "crypto";

const router = express.Router();

// const generateSignToken = (_id) => {
//   return jwt.sign({ _id }, process.env.JWT_SECRET, {
//     expiresIn: '2d',
//   });
// };

const generateSignToken = (_id, email, role) => {
  const payload = {
    _id,
    email,
    role,
  };
  const exp = { expiresIn: process.env.LOGIN_EXP };
  const secretkey = process.env.JWT_SECRET;
  return jwt.sign(payload, secretkey, exp);
};


router.post('/users', async (req, res, next) => {
  const { _id, name, email, password, address, dateOfBirth, city } = req.body;

  try {
      // 1. Check if user exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        console.log('User already exists')
        return res.status(400).json({ message: 'User already exists' });
      }
      console.log('User does not exists')
      
      // 2. Create the user
      const user = await User.create({
          _id,
          name,
          email,
          password,
          address,
          dateOfBirth,
          city,
      });
      
      console.log('Got here')
      // 3. Generate a random token for the user
      const verificationToken = user.createEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      // 4. Send the token to the user via email
      const verifyUrl = `${req.protocol}://${req.get('host')}/${process.env.UI_VERIFICATION_PATH}?token=${verificationToken}`;
      let emailVerificationMessage = 'none';
      const message = `<html>
      <head>
        <style>
          .button {
            color: #FFF;
            cursor: pointer;
            padding: 10px 18px;
            border-radius: 10px;
            background-color: #23BE30;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <p>Hi ${user.name},</p>
        
        <p>
          Your account registration is successful. 
          Please click on 'verify email' below to verify your email.
        </p>
        <div style="text-align: center;">
          <a href="${verifyUrl}" class="button">VERIFY EMAIL</a>
        </div>

  
        <p>This code expires after 10 minutes from the request time.</p>
      </body>
      </html>`;
      

      try {
          await sendEmail({
              sender: 'KRISTY <amamie.kristy@gmail.com>',
              email: user.email, 
              subject: "Registration Successful",
              message: message
          });
          emailVerificationMessage = `Email verification mail has been sent to ${user.email}, please verify your email address.`;
      } catch (err) {
          user.emailVerificationToken = undefined;
          user.emailVerificationTokenExp = undefined;
          await user.save({ validateBeforeSave: false });
          emailVerificationMessage = `Email verification mail failed.`;
          console.log(emailVerificationMessage);
      }

      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          emailVerificationMessage,
          // token: signToken(user._id, user.email, user.role),
          token: generateSignToken(user._id, user.email, user.role),
      });
  } catch (err) {
      next(err);
  }
});


router.post('/users/verifyemail/:token', async (req, res, next) => {
  try {
      const cryptotoken = crypto
          .createHash("sha256")
          .update(req.params.token)
          .digest("hex");

      const user = await User.findOne({ emailVerificationToken: cryptotoken });

      if (!user) {
          return next(new CustomError("Verification token is invalid or has expired", 404));
      }

      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExp = undefined;
      await user.save(); // Use await to ensure save completes before proceeding

      // Exclude sensitive fields
      const limitedUser = user.toObject();
      delete limitedUser.password;
      delete limitedUser.passwordChangedAt;
      delete limitedUser.passwordResetToken;
      delete limitedUser.passwordResetTokenExp;
      delete limitedUser.emailVerificationToken;
      delete limitedUser.emailVerificationTokenExp;

      const token = generateSignToken(user._id, user.email, user.role)
      
      res.status(201).json({
          status: "success",
          token,
          resource: "user",
          action: "email-verify and auto login",
          data: limitedUser,
      });
  } catch (err) {
      next(err); // Pass errors to the global error handler
  }
});


router.post('/users/forgotpassword', async (req, res, next) => {
  try {
    // 1. CONFIRM IF A USER WITH THAT EMAIL EXISTS IN DB
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new CustomError(`We could not find a user with the given email (${req.body.email})`, 404));
    }

    // 2. GENERATE A RANDOM TOKEN FOR THE USER
    const resetToken = await user.createResetPasswordToken();

    // 3. SAVE THE TOKEN AND EXPIRY DATE IN THE DATABASE
    await user.save({ validateBeforeSave: false });

    // 4. SEND THE TOKEN TO THE USER VIA EMAIL
    const resetUrl = `${HOST}/${process.env.UI_PASSWORD_RESET_PATH}?resetToken=${resetToken}`;

    const message = `<html>
      <head>
        <style>
          .button {
            color: #FFF;
            cursor: pointer;
            padding: 10px 18px;
            border-radius: 10px;
            background-color: #23BE30;
            text-align: center;
            text-decoration: none;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <p>Hi ${user.name},</p> 
        <p>We have received your password reset request.</p>
        <p>If you need to change your password, click on 'reset password' below to change your password.</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button"><b>RESET PASSWORD</b></a>
        </div>
        <p>This code expires after 10 minutes from the request time.</p>
      </body>
      </html>`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset request",
        message: message,
      });

      res.status(200).json({
        status: "success",
        message: "Password reset email sent successfully",
      });
    } catch (err) {
      // Destroy the saved token and then throw error
      user.passwordResetToken = undefined;
      user.passwordResetTokenExp = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new CustomError('There is an error sending the password reset email. Please try again later.', 500));
    }
  } catch (error) {
    return next(error);
  }
});




router.post('/users/resetpassord/:Token', async (req, res, next) => {

  const cryptotoken = crypto
  .createHash("sha256")
  .update(req.params.Token)
  .digest("hex");

  const user = await User.findOne({
    passwordResetToken: cryptotoken,
    passwordResetTokenExp: { $gt: Date.now() },
  });


  if (!user) {
    const userx = await User.findOne({ passwordResetToken: cryptotoken });
    if (userx) {
      // there is a pasward reset token, delete it
      userx.password = req.body.password;
      userx.passwordResetToken = undefined;
      userx.passwordResetTokenExp = undefined;
    }

    const error = new Error("Token is invalid or has expired", 404);
    next(error);
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetTokenExp = undefined;


  user.save(); // we want to allow validation

  //4 SEND THE TOKEN TO THE USER VIA EMAIL
    const message = `<html>
    <head>
      <style>
        .button {
          color: #FFF;
          cursor: pointer;
          padding: 10px 18px;
          border-radius: 10px;
          background-color: #23BE30;
          text-align: center;
          text-decoration: none;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <p>Hi ${user.name},</p> 
      Your password has been reset succesffully.
      <p>
      Please notify us at support@example.com if you did not perform this password reset:
      </p>
    </body>
    </html>`;

    let passwordresetMessage = ''
    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset request",
        message: message,
      });
      passwordresetMessage = `Password reset mail successfull.`;
    } catch (err) {
      errormessage = `There is an error sending password reset email. Please try again later`
      passwordresetMessage = `Password reset mail failed.`;
    }


  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    passwordresetMessage,
    token: generateSignToken(user._id, user.email, user.role),
  });

})





router.post('/users/changepassword', protect, async (req, res, next) => {
  try {
      const { oldpassword, newpassword } = req.body;

      // Get user and include password field
      const user = await User.findById(req.user._id).select("+password");

      // Validate old password
      const isMatch = await user.comparePasswordInDb(oldpassword, user.password);
      if (!isMatch) {
          return next(new CustomError("Incorrect login details", 400));
      }

      // Update password and reset password-related fields
      user.password = newpassword;
      user.passwordChangedAt = Date.now();
      user.passwordResetToken = undefined;
      user.passwordResetTokenExp = undefined;
      await user.save(); // Use await to ensure save completes before proceeding

      res.status(200).json({
          status: "success",
          resource: "user",
          action: "password change",
      });
  } catch (err) {
      next(err); // Pass errors to the global error handler
  }
});



// Login user
router.post('/users/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // token: generateSignToken(user._id),
        token: generateSignToken(user._id, user.email, user.role),

      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
      next(err);
    }
});

// Get all users (protected)
router.get('/users', protect, Restrict('admin', 'supperadmin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-__v -date -password');
    res.status(201).json(users);
  } catch (err) {
      next(err);
    }
});

// Get one user (protected)
router.get('/:userId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-__v -date -password');
    res.json(user);
  } catch (err) {
      next(err);
    }
  
});

export default router;
