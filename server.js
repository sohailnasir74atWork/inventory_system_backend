const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
const userRoute = require("./routes/userRoute")
const errorHnadler = require("./controllers/errorHandler/errorHandler")
const cookieParser = require("cookie-parser")
//////////////////////////////////////////EXPRESS RUNNING////////////////////////////////////////////
const app = express()

const PORT = process.env.PORT || 5000
///////////////////////////////////////MIDDLEWARE/////////////////////////////////////////////
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(bodyParser.json())

/////////////////////////////////////Middle Router//////////////////////////////////////////////
app.use("/api/users", userRoute)
///////////////////////////////////////////////SERVER CONNECTION////////////////////////////////
app.use(errorHnadler)
app.get("/", (req, res)=>{
    res.send("I am looking forward to see this")
})
mongoose.connect(process.env.MONGO_URI).then(()=>{
app.listen(PORT, ()=>{
    console.log(`DB is connected on port: ${PORT}`);
})
}
).catch((err)=> console.log(err))
