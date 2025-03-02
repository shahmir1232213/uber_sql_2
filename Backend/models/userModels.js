const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            required:true,
            type:String,
            minLength:[3,'Enter atleast 3 characters']
        },
        lastName:{
            required:true,
            type:String,
            minLength:[3,'Enter atleast 3 characters']
        },
    },
    email:{
        required:true,
        unique:false,
        type:String,
    },
    password:{
        required:true,
        type:String,
        minLength:[3,'Your Password must contain atleast 5 characters'],
        select:false
    },
    socketId:{
        type:String
    }
})
//Instance method is called on docs
userSchema.methods.generateAuthToken = function() {
    let payLoad = { _id: this._id };  
    let token = jwt.sign(payLoad, process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
    return token;
};
//Instance method is called on docs
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//Static method is called on userModel
userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;