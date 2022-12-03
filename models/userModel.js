const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema({
    name:{
        type : String,
        reurired: [true, "Please insert name"]
    },
    email:{
        type : String,
        reurired: [true, "Please insert email"],
        unique: true,
        trim: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please insert valid email"]
    },
    password:{
        type : String,
        reurired: [true,"Please insert password"],
        minlength: [6, "Password should be more then 6 charactors"],
        // maxlength: [12, "Password should be less then 12 charactors"]
    },
    bio:{
        type : String,
        maxlength: [200, "Bio must not be more then 200 character"],
        default: "Bio"
    },
    phone:{
        type : String,
        default: "123456789"
    },
    photo:{
        type : String,
        reurired: [true, "Please insert photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    }
})
userSchema.pre("save", async function(){

} )
/////////////////////////////////////passord encyp/////////////////
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  });
/////////////////////////////////////////////////////////
const User = mongoose.model("user", userSchema )

module.exports = User