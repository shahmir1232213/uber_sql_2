const mapServices = require('./mapServices')
const rideModel = require('../models/rideModel')
const crypto = require('crypto')
const Module = require('module')

module.exports.getFare = async (pickup,destination)=>{
    if(!pickup||!destination){
        throw new Error ("Pickup and destination required")
    }
    let distance_and_duration = await mapServices.getDistanceTime(pickup,destination)
    
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };


    const fare = {
        auto: Math.round(baseFare.auto + ((distance_and_duration.distance.value / 1000) * perKmRate.auto) + ((distance_and_duration.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distance_and_duration.distance.value / 1000) * perKmRate.car) + ((distance_and_duration.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distance_and_duration.distance.value / 1000) * perKmRate.moto) + ((distance_and_duration.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;

}
function getOtp(){
    let otp = crypto.randomInt(100, 10000);
    console.log("otp: ",otp)
    return otp;

}

module.exports.createRide = async (user,pickup,destination,vehicleType,fare) =>{
    if(!user||!vehicleType||!pickup||!destination){
        throw new Error ("All fields are required")
    }
    const ride = await rideModel.create({
        user:user,
        pickup:pickup,
        destination:destination,
        fare:fare,
        vehicleType,
        otp:getOtp()
    })
    return ride;
}
module.exports.confirmRide = async (_id,captinId)=>{
    if (!_id) {
        throw new Error('Ride id is required');
    }
    console.log("captinId: ",captinId)
    await rideModel.findOneAndUpdate(
        {_id},
       { 
        $set:{
            status: 'accepted',
            captin: captinId
        }
       },
       {new:true}
    )
    const ride = await rideModel.findById(_id).populate('user').populate('captin').select('+otp');
    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}

module.exports.cancelRide = async (rideID,message) => {
    if (!rideID) {
        throw new Error('Ride id is required');
    }
    try{
        let ride = await rideModel.findOneAndUpdate(
            {_id:rideID},
        { 
            $set:{
                status: message,
            }
        },
        {new:true}
        )
        return ride;
    }
    catch(err){
        console.log("Error from module.exports.cancelRide: ",err.message)
    }    
}

module.exports.startRideService = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captin').select('+otp');
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }
     ride.status = "ongoing";
     await ride.save();
     return ride;
}

module.exports.endRide = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captin').select('+otp');
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }
     ride.status = "completed";
     await ride.save();
     return ride;
}