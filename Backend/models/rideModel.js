const mongoose = require('mongoose')
const rideSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true
    },
    captin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'captinModel',
    },
    vehicleType:{
        type:String,
        require:true
    },
    pickup:{
        type:String,
        require:true
    },
    destination:{
        type:String,
        require:true
    },
    fare:{
        type:Number,
        require:true
    },
    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled by user','cancelled by rider' ],
        default: 'pending',
    },
    duration: {
        type: Number,
    }, 
    distance: {
        type: Number,
    },
    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp:{
        type:Number,
        require:true,
        select:false,
        unique:true
    }
})

module.exports = mongoose.model('ride',rideSchema)