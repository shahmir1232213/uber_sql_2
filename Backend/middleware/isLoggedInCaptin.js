const jwt = require("jsonwebtoken");
const captinModel = require("../models/captinModel");
const blackListTokenModel = require("../models/blackListTokenSchema");

async function isLoggedInCaptin(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }
    let isBlackListed = await blackListTokenModel.findOne({token:token})
    if(!isBlackListed){
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const captin = await captinModel.findById(decoded._id);
        //console.log("from bakcend captin: ",captin)
        req.captin = captin;
        
        return next();
    }
    else{
        return res.status(401).json({message:'Unauthorized'}) 
    }    
}
module.exports = isLoggedInCaptin;
