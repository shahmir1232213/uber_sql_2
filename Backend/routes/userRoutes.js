const express = require("express")
const router = express.Router();
const {body,validationResult} = require("express-validator")
const userController = require("../controllers/userController");
const isLoggedInUser = require("../middleware/isLoggedInUser");

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstName').isLength({min:3}).withMessage('First name must be atleast 3 characters long'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long'),   
],userController.register)
//console.log("React reached: ",req.body)
//})
router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:3}).withMessage("Invalid Length of Password"),
],userController.login)

router.get('/home',isLoggedInUser,userController.home)

router.post("/logout",isLoggedInUser,userController.logout)    

module.exports = router;