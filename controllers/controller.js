const asyncHanhler = require("express-async-handler")
const User = require("../models/userModel")
const registerUser= asyncHanhler( async (req, res)=>{

   const {name, password, email} = req.body
   console.log(req.body);
   if(!name || !email || !password){
        res.status(400)
        throw new Error ("Please inter all fields")
    }
   if (password.length<6 || password.length>6){
    res.status(400)
    throw new Error ("Password should be longer then 6 and lesser then 12 charactors")
   }
   const userExist = await User.findOne({email})
   if(userExist) { 
    res.status(400)
    throw new Error ("This email already regestered")
   }
   
    const user = await User.create({
        name,
        password,
        email
    })
    console.log(user);
    if(user){
        const {_id, name, email,bio, phone, photo} = user
        res.status(201).json({
            _id, name, email,bio, phone, photo
        })
    }
    else
        res.status(400)
        throw new Error ("Invalid user data")
       

    
   
    
})

module.exports = registerUser