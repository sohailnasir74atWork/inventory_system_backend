const express = require("express")
const {registerUser, loginUser, logOut} = require("../controllers/controller")
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logOut)


module.exports = router