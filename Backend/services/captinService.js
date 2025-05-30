const sql = require('mssql/msnodesqlv8');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

async function hash_Password(password){
    return await bcrypt.hash(password, 10);
}
async function compare_Password ({PASSWORD},inputPassword) {
    //console.log("passqord: ",PASSWORD)
    return await bcrypt.compare(inputPassword,PASSWORD);
}
function generateAuthToken({FIRST_NAME,CAPTIN_ID}) {
    let payLoad = {CAPTIN_ID,FIRST_NAME};  
    let token = jwt.sign(payLoad, process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
    return token;
}
module.exports = {
    hash_Password,
    generateAuthToken,
    compare_Password
}