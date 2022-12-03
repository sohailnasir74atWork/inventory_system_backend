const asyncHanhler = require("express-async-handler");
// const dotenv = require("dotenv").config()
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const errorHnadler = require("../middleware/errorHandler");

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
            token

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
    console.log(user);
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
module.exports = {registerUser, loginUser, logOut, getUser, statusLogin, updateUser}