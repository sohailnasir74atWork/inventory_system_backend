const asyncHanhler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protect = asyncHanhler(async (req, res, next)=>{
    const token = req.cookies.token
    console.log(token);
    if(!token){
        res.status(400)
        throw new Error ("Not authorized, please login")
    }
   const verify =  await jwt.verify(token, process.env.JWT_SECRET)
   const user = await User.findById(verify.id).select("-password")
   if(!user){
    res.status(400)
    throw new Error ("Not authorized, please login")
   }
   req.user = user
   next()

})
module.exports = protect