const mongoose = require("mongoose")

const tokenSchema = mongoose.Schema({
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:user
    },
    token:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    },
    expiredAt:{
        type: Date,
        required: true
    },
    

},
)
const token = mongoose.model("token", tokenSchema)
module.exports = token