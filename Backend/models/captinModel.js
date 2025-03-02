const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

let captinSchema = mongoose.Schema({
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
        minLength:[5,'Your Password must contain atleast 5 characters'],
        select:false
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'Color must be atleas 3 characters long']
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,'Number Plate must be atleas 3 characters long']
        },
        capacity:{
            type:Number,
            required:true,
            min:[2,'Minimum Capacity should be 2']
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['Car','MotorCycle','Auto']
        }
    },
    location:{
        latitude:Number,
        longitude:Number
    },
    socketId: {
        type: String,
    },
})
captinSchema.methods.generateAuthToken = function() {
    let payLoad = { _id: this._id };  
    let token = jwt.sign(payLoad, process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
    return token;
};
//Instance method is called on docs
captinSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//Static method is called on captinModel
captinSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
};
let captinModel = mongoose.model("captinModel",captinSchema);
module.exports = captinModel;