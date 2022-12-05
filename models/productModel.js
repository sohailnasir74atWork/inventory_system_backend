const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    name:{
        type: String,
        required: [true, "Please add a name"],
        trim: true
    },
    sku:{
        type: String,
        required: true,
        trim: true,
        default: "SKU"
    },
    catagory:{
        type: String,
        required: [true, "Please add a catagory"],
        trim: true
    },
    quantity:{
        type: String,
        required: [true, "Please add a quantity"],
        trim: true
    },
    price:{
        type: String,
        required: [true, "Please add a price"],
        trim: true
    },
    description:{
        type: String,
        required: [true, "Please add a discription"],
        trim: true
    },
    image:{
        type: Object,
        default: {}
    },
    
    

},
{
    timestemp: true
}
)
const Product = mongoose.model("Product", productSchema)
module.exports = Product