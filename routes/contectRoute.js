const express = require("express")

const contectUs = require("../controllers/contectController")
const protect = require("../middleware/authenticationMiddleware")

const router = express.Router()

router.post("/",protect, contectUs)

module.exports = router