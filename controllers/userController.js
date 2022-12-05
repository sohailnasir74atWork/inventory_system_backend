const asyncHanhler = require("express-async-handler");
// const dotenv = require("dotenv").config()
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const bcrypt = require("bcryptjs");
const errorHnadler = require("../middleware/errorHandler");
const sendEmail = require("../uTILS/sendMail");
const Token = require("../models/tokenModel");


const genToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

const registerUser= asyncHanhler( async (req, res)=>{

   const {name, password, email} = req.body
   if(!name || !email || !password){
        res.status(400)
        throw new Error ("Please inter all fields")
    }
   if (password.length<6 || password.length>6){
    res.status(400)
    throw new Error ("Password should be longer then 6 charactors")
   }
   const userExist = await User.findOne({email})
   if(userExist) { 
    res.status(400)
    throw new Error ("This email already regestered")
   }
   ///////////////////////encrypt create password//////////////////////////////////

   
    const user = await User.create({
        name,
        password,
        email
    })
    /////////////////////////////////jwt/////////////////////
    const token = genToken(user._id)
    /////////////////////////send http cookies/////////////////
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        // secure: true,
      });
      
    //////////////////////////////////////////////////////////
    if(user){
        const {_id, name, email,bio, phone, photo,} = user
        res.status(201).json({
            _id, name, email,bio, phone, photo, token
        })
    }
    else
        {res.status(400)
        throw new Error ("Invalid user data")}   
})
const loginUser = asyncHanhler(async (req, res)=>{
    const {email , password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error ("Please insert valid email or password")
    } 
    const user = await User.findOne({email})
    if(!user){
        res.status(400)
        throw new Error ("User Does not exist")
    }
    const token = genToken(user._id)
    /////////////////////////send http cookies/////////////////
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        // secure: true,
      });
      

    
    const isvalidPassword = await bcrypt.compare(password, user.password)
    if(!isvalidPassword){
        res.status(400)
        throw new Error ("Incorrect email or password")

    }
    if(user && isvalidPassword){
        const {_id, name, email,bio, phone, photo,} = user
        res.status(200).json({
            _id,
            name,
            email,
            bio,
            photo,
            phone,
            token,
            

        })
    }
}

)

const logOut = asyncHanhler(async(req, res)=>{
    res.cookie("token","", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 1 day
        sameSite: "none",
        secure: true,
      });
      return res.status(200).json({message:"Successfully loged out"})
    })
    const getUser = asyncHanhler(async(req, res)=>{
        const user = await User.findById(req.user._id)
        if(!user){
        res.status(400)
        throw new Error ("User is not available")
        }

        const {_id, name, email,bio, phone, photo,} = user
        res.status(200).json({
            _id,
            name,
            email,
            bio,
            photo,
            phone,

        })
    })
const statusLogin = asyncHanhler(async(req, res)=>{
        const token = req.cookies.token
        if(!token){res.json(false)}
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        if(!token){res.json(false)}
        if(verify) res.json(true)
})
const updateUser = asyncHanhler(async(req, res)=>{
    const user = await User.findById(req.user._id)
    if(!user){
        res.status(400)
        throw new Error ("User is not available")
    }
    if(user){
    const {name, email, bio, phone, photo, _id} = user
    user.email = email
    user.name = req.body.name || name
    user.bio = req.body.bio || bio
    user.phone = req.body.phone || phone
    user.photo = req.body.photo || photo
    const updated = await user.save()
    res.status(200).json({
        _id:updated._id,
        name:updated.name,
        bio:updated.bio,
        photo:updated.photo,
        phone:updated.phone,
        email:updated.email
    })} else{
        res.status(400)
        throw new Error ("User is not available")
    }
})
const changedPassword = asyncHanhler(async(req, res)=>{
    const user = await User.findById(req.user._id)
    const {oldPassword, password} = req.body
    if(!oldPassword || !password) {
        res.status(400)
        throw new Error ("Please enter new and old passwords")
    }
    const oldpasswordIsCorrect = await bcrypt.compare(oldPassword, user.password)
    if(!oldpasswordIsCorrect){
        res.status(400)
        throw new Error ("Old password is not correct")  
    }
    if (user && oldpasswordIsCorrect){
        user.password = password
        await user.save()
        res.status(200).json("Password is successfully changed")
    }
    else{
        res.status(400)
        throw new Error ("Invalid request")
    }
})
const forgetPassword = asyncHanhler(async(req, res)=>{
    const {email} = req.body
    const user = await User.findOne({email})
        if(!user){
        res.status(400)
        throw new Error ("User does not exists")  
        }
        let tokenAvailabe = await Token.findOne({userid:user._id})
        if(tokenAvailabe){ await tokenAvailabe.deleteOne()}
        let token = await crypto.randomBytes(32).toString("hex") + user._id
        console.log(token);
        
        const hashedToken = await crypto.createHash("sha256").update(token).digest("hex")
        await new Token({
            userid: user._id,
            token: hashedToken,
            createdAt: Date.now(),
            expiredAt: Date.now() + 30 * 60 * 1000
        }).save()
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${token}`
        const message = `
        <h2>Hello ${user.name}</h2>
        <p> This is your reset url, it will expires in 30 Miutes</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`
        const subject = "Password Reset Email"
        const send_to = user.email
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
const resetPassword = asyncHanhler(async(req, res)=>{
    const {password} = req.body
    const {resetToken} = req.params
    
    const hashedToken = await crypto.createHash("sha256").update(resetToken).digest("hex")
    const checkInDatabase = await Token.findOne({
        token:hashedToken,
        expiredAt:{
            $gt:Date.now()
        }
     }) 
    if(!checkInDatabase){
        res.status(400)
        throw new Error ("Link is not valid")
    }
    const user = await User.findOne({_id:checkInDatabase.userid})
    user.password = password
    await user.save()
    res.status(400).json("successfull")
})
module.exports = {registerUser, loginUser, logOut, getUser, statusLogin, updateUser, changedPassword, forgetPassword, resetPassword}