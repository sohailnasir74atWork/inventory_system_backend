const Product  = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const { fileSizeFormatter } = require("../uTILS/uploadFiles")

const createProduct = asyncHandler(async(req, res)=>{
    const {name, quantity, price, description, image, sku, catagory} = req.body
    if (!name || !quantity || !price || !description || !catagory){
        res.status(400)
        throw new Error ("Name, Quantity, Price, Description & Catagory fields are mandatory, please make saure to insert all of these")
    }
    let fileData = {}
    if(req.file){
        fileData = {
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            filePath: req.file.path,
            fileSize: fileSizeFormatter(req.file.size, 2)

        }
    }
    const product = await Product.create(
        {
            user: req.user.id,
            name, 
            quantity, 
            price, 
            description, 
            image, 
            sku, 
            catagory,
            image: fileData
        }
    )
    if(!product){
        res.status(400)
        throw new Error ("Product not available")
    }
    if(product){
    res.status(200).json(product)
}
})

////////////////////////////////////////////////////////////////////////
module.exports = createProduct