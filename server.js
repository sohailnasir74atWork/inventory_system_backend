const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
//////////////////////////////////////////////////////////////////////////////////////
const app = express()
const PORT = process.env.PORT || 5000
//////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(process.env.MONGO_URI).then(()=>{
app.listen(PORT, ()=>{
    console.log(`DB is connected on port: ${PORT}`);
})
}
).catch((err)=> console.log(err))
