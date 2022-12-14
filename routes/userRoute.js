const express = require("express")
const {registerUser, loginUser, logOut, getUser, statusLogin, updateUser, changedPassword,forgetPassword, resetPassword,} = require("../controllers/userController")

const protect = require("../middleware/authenticationMiddleware")
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logOut)
router.get("/userinfo",protect, getUser)
router.get("/logedinstatus", statusLogin)
router.patch("/updateduser",protect, updateUser)
router.patch("/changepassword",protect, changedPassword)
router.post("/forgetpassword", forgetPassword)
router.put("/resetpassword/:resetToken", resetPassword)




module.exports = router