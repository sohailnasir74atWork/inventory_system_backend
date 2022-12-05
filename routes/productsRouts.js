const express = require("express")
const createProduct = require("../controllers/productController")
const protect = require("../middleware/authenticationMiddleware")
const {upload} = require("../uTILS/uploadFiles")
const router = express.Router()
router.post("/createproduct", protect, upload.single("image"), createProduct)
module.exports = router