const nodemailer = require("nodemailer")
const asyncHandler = require("express-async-handler")
const sendEmail = asyncHandler(async(subject, message, send_to, send_from, reply_to)=>{
    const trasnporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls:{
            rejectUnauthorized: false
        }
    }
    )
    const options = {
        from: send_from,
        to: send_to,
        replyto: reply_to,
        subject: subject,
        html: message

    }
    trasnporter.sendMail(options, function(err, info){
        if(err) console.log(err);
        if(info) console.log(info);
    })

})
module.exports = sendEmail