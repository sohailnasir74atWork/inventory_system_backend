const Product  = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const { fileSizeFormatter } = require("../uTILS/uploadFiles")
const { options } = require("../routes/userRoute")
const cloudinary = require("cloudinary").v2

const createProduct = asyncHandler(async(req, res)=>{
    const {name, quantity, price, description, sku, catagory} = req.body
    if (!name || !quantity || !price || !description || !catagory){
        res.status(400)
        throw new Error ("Name, Quantity, Price, Description & Catagory fields are mandatory, please make saure to insert all of these")
    }
    let fileData = {}
    if(req.file){
        let uploadedFile
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "Inventory app",
                resourse_type: "image"

            })
        } catch (error) {
            res.status(500)
            throw new Error("File did not uploaded")
            
        }
        fileData = {
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            filePath: uploadedFile.secure_url,
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

const getProducts = asyncHandler(async(req, res)=>{
    const products = await Product.find({user:req.user.id})
    
    res.status(200).json(products)
})
const getSingleProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
    if(!product){
        res.status(400)
        throw new Error ("Product not available")
    }
    if(product.user.toString()!== req.user.id){
        res.status(400)
        throw new Error ("User not authorized") 
    }
    res.status(200).json(product)

})
const deleteSingleProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params
    if(!product){
        res.status(400)
        throw new Error ("Product not available")
    }
    if(product.user.toString()!== req.user.id){
        res.status(400)
        throw new Error ("User not authorized") 
    }
    res.status(200).json("Deleted Successfully ")

})
// const updateProduct = asyncHandler(async(req, res)=>{
//     const {name, quantity, price, description, image, sku, catagory} = req.body
//     const {id} = req.params
//     let fileData = {}
//     if(req.file){
//         let uploadedFile
//         try {
//             uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//                 folder: "Inventory app",
//                 resourse_type: "image"

//             })
//         } catch (error) {
//             res.status(500)
//             throw new Error("File did not uploaded")
            
//         }
//         fileData = {
//             fileName: req.file.originalname,
//             fileType: req.file.mimetype,
//             filePath: uploadedFile.secure_url,
//             fileSize: fileSizeFormatter(req.file.size, 2)

//         }}
//////////////////////////////////////////////////////////////////////////////////////////////////
const updateProduct = asyncHandler(async(req, res)=>{
    const {name, quantity, price, description, sku, catagory} = req.body
    const { id } =  req.params
    ////////////////////////geting upload file
    let fileData = {}
    if(req.file){
        let uploadedFile
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "Inventory app",
                resourse_type: "image"

            })
        } catch (error) {
            res.status(500)
            throw new Error("File did not uploaded")
            
        }
        fileData = {
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            filePath: uploadedFile.secure_url,
            fileSize: fileSizeFormatter(req.file.size, 2)

        }
    }
    //////////////////////////////////////////////////updated the product data///////////
    const product = await Product.findById({_id:id})
    const updatedProduct = await Product.findByIdAndUpdate(
        {_id:id},
        {
            name, 
            quantity, 
            price, 
            description, 
            sku, 
            catagory,
            image: Object.keys(fileData).length === 0 ? product?.image : fileData, 
        }
    )
    if(!updatedProduct){
        res.status(400)
        throw new Error ("Product not available")
    }
    if(updatedProduct){
    res.status(200).json(updatedProduct)
}
})

////////////////////////////////////////////////////////////////////////
module.exports = {createProduct, getProducts, getSingleProduct, deleteSingleProduct, updateProduct}