const sendMail = require("../services/mailService"); 
const crypto = require('crypto');
const userModel = require("../models/userModels");
const mailService = require("../services/mailService");
const bcrypt = require("bcrypt")

async function forgotPassword(req,res){
    return res.render("forgetPass")
}

function generateCode() {
    const randomBytes = crypto.randomBytes(3); // Generates 3 random bytes
    const code = randomBytes.readUIntLE(0, 3) % 1000000; // Converts bytes to a number, ensures it fits within 6 digits
    return code.toString().padStart(6, '0'); // Pads the result with leading zeros if necessary
}


async function verifyEmail(req,res,next){
    //let {email} = req.body;
    //console.log("email: ",req.body.email)
    let user = await userModel.findOne({email:req.body.email});
    console.log("user: ",user)
    if(user){
        let code = generateCode();
        let message = `Dear ${user.fullName.firstName+' '+user.fullName.lastName},  

        Your One-Time Password (OTP) for Walmart E-commerce is ${code}. Please use this code to complete your verification process.  
        
        This is an auto-generated email. Please do not reply to this message.` 
        await mailService(user.email,"Password Reset",message)
        req.code = code; 
        res.locals.flag = true;
        console.log("code: ",code)
        return res.status(200).json(code)
    }
}

async function verifyCode(req,res){
    console.log("req.code: ",req.code)
    return 
}

module.exports = {
    forgotPassword,
    verifyEmail,
    verifyCode
}