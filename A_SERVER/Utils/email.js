// npm install nodemailer

import nodemailer from 'nodemailer';

const sendEmail = async (option) => {
    try {

        // CREATE TRANSPORTER 
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports like 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false, // = if you encounter self-signed certificate issues
            }
        });

        // DEFINE EMAIL OPTIONS
        const emailOptions = {
            from: option.sender,
            to: option.email,
            subject: option.subject,
            html: option.message,
        };

        // sending the mail
        await transporter.sendMail(emailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
}

export default sendEmail;
