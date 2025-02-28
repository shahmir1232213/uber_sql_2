const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");
const blackListTokenModel = require("../models/blackListTokenSchema");

async function isLoggedInUser(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    //console.log("Token reached backend: ",token)
    if(!token){
        return res.status(401).json({message:'Token not found'})
    }
    let isBlackListed = await blackListTokenModel.findOne({token:token})
  //  console.log("isBlackListed: ",isBlackListed)
    if(!isBlackListed){
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded._id);
        req.user = user;
        return next();
    }
    else{
        return res.status(401).json({message:'Unauthorized'}) 
    }    
}
module.exports = isLoggedInUser;
