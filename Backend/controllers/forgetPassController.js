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
        let message = 
        `Dear ${user.fullName.firstName+' '+user.fullName.lastName},  
            Your One-Time Password (OTP) for Uber App is ${code}. Please use this code to complete your verification process.  
        This is an auto-generated email. Please do not reply to this message.` 
        await mailService(user.email,"Password Reset",message)
        req.code = code; 
        res.locals.flag = true;
        console.log("code: ",code)
      //  next();
        return res.status(200).json(code)
    }
}

function verifyCode(req,res){
    console.log("req.code: ",req.body)
    let code = req.body.code;
    let input = req.body.input;
    if (input === code) {
        return res.status(200).json({ status: 200, message: "Code is correct" });
    } else {
        return res.status(400).json({ status: 400, message: "Code is incorrect" });  // Opposite response
    }
}
async function changePass(req,res){
    console.log("passss changed: ",req.body.email)
    let user = await userModel.findOne({ email:req.body.email });
    let newPass = req.body.newPass;
    newPass = await userModel.hashPassword(newPass)
    user.password = newPass;
    await user.save()
    console.log("user: ",user)
    return res.status(200).json({ status: 200, message: "Password updated successfully" });

}
module.exports = {
    forgotPassword,
    verifyEmail,
    verifyCode,
    changePass
}