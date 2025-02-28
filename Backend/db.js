const mongoose = require("mongoose")
async function mongooseConnection (){
    try{ 
        const connection = await mongoose.connect(process.env.DB_CONNECT)
        console.log("Mongoose Connected")
        return connection;
    }
    catch{
        console.log("Failed to connect Mongooose")
    }
    
}
module.exports = mongooseConnection();
