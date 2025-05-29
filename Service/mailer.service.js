import nodemailer from 'nodemailer'
import env from "dotenv"
env.config()

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
});

const mailSender = async (email, subject, content) => {
    const info = await transporter.sendMail({
        from: "Rohan Bisht " + process.env.MAIL_USER,
        to: email, // list of receivers
        subject: subject, // Subject line
        html: content, // HTML text body
    });
    console.log("Message sent: %s", info.messageId);
}


export default mailSender
