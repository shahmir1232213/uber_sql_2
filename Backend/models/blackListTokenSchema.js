const mongoose = require("mongoose")

const blackListTokenSchema = mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:84600
    }
})

const blackListTokenModel = mongoose.model('BlackListToken',blackListTokenSchema);
module.exports = blackListTokenModel;