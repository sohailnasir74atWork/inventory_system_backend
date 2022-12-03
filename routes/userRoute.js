const express = require("express")
const {registerUser, loginUser, logOut, getUser, statusLogin, updateUser} = require("../controllers/controller")
const protect = require("../middleware/authenticationMiddleware")
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logOut)
router.get("/userinfo",protect, getUser)
router.get("/logedinstatus", statusLogin)
router.patch("/updateduser",protect,  updateUser)


module.exports = router