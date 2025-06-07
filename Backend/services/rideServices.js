const mapServices = require('./mapServices')
//const rideModel = require('../models/rideModel')
const crypto = require('crypto')
const Module = require('module')
const sql = require('mssql/msnodesqlv8');

module.exports.getFare = async (pickup,destination)=>{
    if(!pickup||!destination){
        throw new Error ("Pickup and destination required")
    }
    let distance_and_duration = await mapServices.getDistanceTime(pickup,destination)
    // console.log("pickup: ",pickup)
    // console.log("destination: ",destination)
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

module.exports.createRide = async (user,pickup,destination,vehicleType,fare,distance,duration) =>{
    if(!user||!vehicleType||!pickup||!destination){
        throw new Error ("All fields are required")
    }
    try{
        console.log("distance bakra: ",distance)
        console.log("duration bakra: ",duration)
        var ride = await sql.query`
        INSERT INTO RIDE(USER_ID, PICKUP, DESTINATION, FARE, VEHICLE_TYPE, OTP,DISTANCE,DURATION)
        OUTPUT INSERTED.* 
        VALUES (${user}, ${pickup}, ${destination}, ${fare}, ${vehicleType}, ${getOtp()}, ${distance}, ${duration})`;
        //console.log("Ride created: ", ride.recordset[0]);
    }catch(err){
        console.log("Error from module.exports.createRide: ", err.message);
    }
        return ride.recordset[0];
}
module.exports.confirmRide = async (rideId,captinID)=>{
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    console.log("captinId: ",captinID)
    try{
        await sql.query`
            UPDATE RIDE
            SET STATUS = 'accepted', CAPTIN_ID = ${captinID}
            WHERE RIDE_ID = ${rideId};`;          
    }
    catch(err){
        console.log("Error updating ride: ", err.message);
    }
    const ride = await sql.query`SELECT * FROM RIDE WHERE RIDE_ID = ${rideId};`;
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
        // let ride = await rideModel.findOneAndUpdate(
        //     {_id:rideID},
        // { 
        //     $set:{
        //         status: message,
        //     }
        // },
        // {new:true}
        // )
        await sql.query`
            UPDATE RIDE
            SET STATUS = ${message}
            WHERE RIDE_ID = ${rideID};`;
        let ride = await sql.query`SELECT * FROM RIDE WHERE RIDE_ID = ${rideId};`;
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
    var ride = await sql.query`SELECT * FROM RIDE WHERE RIDE_ID = ${rideId};`;
    ride = ride.recordset[0];
    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.STATUS !== 'accepted') {
        throw new Error('Ride not accepted');
    }
     await sql.query`
        UPDATE RIDE
        SET STATUS = 'ongoing'
        WHERE RIDE_ID = ${rideId};
    `;
     ride = await sql.query`SELECT * FROM RIDE WHERE RIDE_ID = ${rideId};`;
     ride = ride.recordset[0];
     return ride;
}

module.exports.endRide = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
      await sql.query`
            UPDATE RIDE 
            SET STATUS = 'completed' 
            WHERE RIDE_ID = ${rideId};
        `;
        let ride = await sql.query`SELECT * FROM RIDE WHERE RIDE_ID = ${rideId};`;
    if (!ride) {
        throw new Error('Ride not found');
    }
    ride = ride.recordset[0];
     return ride;
}