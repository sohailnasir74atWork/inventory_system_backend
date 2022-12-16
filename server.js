const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productsRouts")
const errorHnadler = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const path = require("path")
const contectRoute = require("./routes/contectRoute")
// const multer = require("multer")
//////////////////////////////////////////EXPRESS RUNNING////////////////////////////////////////////
const app = express()

const PORT = process.env.PORT || 5000
///////////////////////////////////////MIDDLEWARE/////////////////////////////////////////////
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(bodyParser.json())
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
/////////////////////////////////////Middle Router//////////////////////////////////////////////
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/contect", contectRoute)
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
