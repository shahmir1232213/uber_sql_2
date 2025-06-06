const express = require("express")
const router = express.Router();
const {body,validationResult} = require("express-validator")
const captinController = require("../controllers/captinController");
const isLoggedInCaptin = require("../middleware/isLoggedInCaptin");

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstName').isLength({min:3}).withMessage('First name must be atleast 3 characters long'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long'),  
    body('vehicle.color').isLength({min:3}).withMessage('Color must be atleas 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Number Plate must be atleas 3 characters long'),
    body('vehicle.capacity').isInt({min:3}).withMessage("Vehicle Capacity must be atleast 2"),
    body('vehicle.vehicleType').isIn(['Car','MotorCycle','Auto']).withMessage("Invalid Vehicle")
],captinController.register)
//router.post('/register',captinController.register)
router.post("/login",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:3}).withMessage("Invalid Length of Password"),
],captinController.login)
router.get('/home',isLoggedInCaptin,captinController.home)

router.post("/logout",isLoggedInCaptin,captinController.logout)    

router.get('/setting',captinController.setting)
module.exports = router;