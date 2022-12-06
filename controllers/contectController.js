const asyncHandler = require("express-async-handler")
const sendEmail = require("../uTILS/sendMail")
const contectUs = asyncHandler(async(req, res)=>{
   const {subject, message} = req.body
   
        const send_to = req.user.email
        const send_from = process.env.EMAIL_USER
        try{
            sendEmail(subject, message, send_to, send_from)
            res.status(200).json({
                success:true,
                message: "yo! email sent seccessfully"
            })

        } catch(error){
            res.status(500)
            throw new Error ("Please try again!")

        }

})

module.exports = contectUs