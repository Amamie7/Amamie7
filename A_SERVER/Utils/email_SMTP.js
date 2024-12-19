import nodemailer from 'nodemailer'; 

const sendEmail = async (option) => {
    //CREATE TRANSPORTER 
    // use mail trap to test sending emails
    // www.mailtrap.io
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }  
    })

// DEFINE EMAIL OPTIONS
const emailOptions = { 
    from: 'KRISTY <amamie.kristy@gmail.com>',
    to: option.email,
    subject: option.subject,
    text: option.message 
}


//sending the mail
await transporter.sendMail(emailOptions)

}

export default sendEmail;

