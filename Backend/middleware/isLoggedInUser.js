const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");
const blackListTokenModel = require("../models/blackListTokenSchema");
const sql = require('mssql/msnodesqlv8');

async function isLoggedInUser(req,res,next){
  // console.log("isLoggedInUser middleware called")
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    //console.log("Token reached backend: ",token)
    if(!token){
        return res.status(401).json({message:'Token not found'})
    }
    let isBlackListed = await sql.query`SELECT * FROM BLACKLIST_TOKENS WHERE token = ${token}`;
    console.log("isBlackListed: ", isBlackListed);
    if (!isBlackListed.recordset || isBlackListed.recordset.length === 0) {
        //console.log("NOT BLACKLISTED TOKEN");
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //console.log("Decoded Token: ", decoded);
        const user = await sql.query`SELECT * FROM USERS WHERE USER_ID = ${decoded.USER_ID}`;
        //console.log("User found: ", user.recordset[0]);
        req.user = user.recordset[0];
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }    
}
module.exports = isLoggedInUser;
