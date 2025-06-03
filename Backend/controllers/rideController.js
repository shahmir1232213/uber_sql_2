const rideService = require('../services/rideServices')
const {validationResult} = require('express-validator')
const mapService = require('../services/mapServices')
const {getCaptinNamespace, getUserNamespace } = require('../sockets')
const rideModel = require('../models/rideModel')
const sql = require('mssql/msnodesqlv8');

module.exports.createRide = async (req,res,next)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    let {pickup,destination,vehicleType,fare} = req.body;
    try{
        console.log("req.user.USER_ID from create ride: ",req.user.USER_ID)
     
        let  pickupCoordinates = await mapService.getAddressCoordinate(pickup);
       console.log("pickup coordinates: ",pickupCoordinates)
        // destinationCoordrinates = await mapService.getAddressCoordinate(destination);
        //console.log("destinantion coordinates: ",destination)
        let ride = await rideService.createRide(req.user.USER_ID,pickup,destination,vehicleType,fare)
        // console.log("otp: ", ride.OTP);
        console.log("Ride created at controller: ", ride);
        let captinRadius = await mapService.getCaptinInTheRadius(pickupCoordinates.ltd,pickupCoordinates.lng,5)
        //console.log("Captin in Radius: ",captinRadius)
       // const rideWithUser = await rideModel.findById(ride._id).populate('user') 
        const rideWithUser = {
            RIDE_ID: ride.RIDE_ID,
            pickup: ride.PICKUP,
            destination: ride.DESTINATION,
            fare: ride.FARE,
            USER_ID: ride.USER_ID
        }
        console.log("rideWithUser: ",rideWithUser)
        let socks;
        captinRadius.forEach(elem=>{
            socks = elem.socketId
        })
        const captinNamespace = getCaptinNamespace();
        captinNamespace.emit('new-ride',rideWithUser)
       // sendMessageToSocketId(socks,{event:'new-ride',data:"70 rupiye lelo bhaiya"})
        console.log("message sent to: ",socks)
        return res.status(201).json(ride)
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

module.exports.getFare = async (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    let {pickup,destination} = req.query;
    console.log("req.query from react: ",req.query)
    try{
        let fare = await rideService.getFare(pickup,destination)
        return res.status(200).json(fare);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

module.exports.confirmRide = async (req,res,next) =>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId,captinID } = req.body;
    //console.log("CAPTIN INFO UPDATED: ",rideId)
  // console.log("contoller req.captin from confirmRide: ",captinID)
    let ride = await rideService.confirmRide(rideId,captinID)
    ride = ride.recordset[0];
   let CAPTIN_NAME = await sql.query`SELECT * FROM CAPTIN WHERE CAPTIN_ID = ${ride.CAPTIN_ID}`;
   CAPTIN_NAME = CAPTIN_NAME.recordset[0].FIRST_NAME + " " + CAPTIN_NAME.recordset[0].LAST_NAME;
   // console.log('CAPTIN_NAME at BACKEND: ', CAPTIN_NAME);
   ride.CAPTIN_NAME = CAPTIN_NAME;
   // console.log('Ride at BACKEND: ', ride);
    let userCompleteData = await sql.query`SELECT * FROM USERS WHERE USER_ID = ${ride.USER_ID}`;
    userCompleteData = userCompleteData.recordset[0];
    userSocketId = userCompleteData.SOCKET_ID;
    //console.log("userSocketId: ",userSocketId)
   // console.log("userCompleteData: ",userCompleteData)
    let userNamespace = getUserNamespace()
    userNamespace.to(userSocketId).emit('ride-confirmed',ride)
    return res.status(200).json(ride);
} 

module.exports.cancelRide = async (req,res,next) => {
    const { rideID,message } = req.body;
    console.log("cancel ride rideID: ",rideID)
   // console.log("module.exports.cancelRide rideID: ",rideID)
    let ride = await rideService.cancelRide(rideID,message);
    return res.status(200).json(ride);
}

module.exports.startRide = async (req,res,next) => {
    // const error = validationResult(req);
    // if(!error.isEmpty()){
    //     return res.status(400).json({ errors: errors.array() });
    // }
    const { rideWithUser } = req.body;
    //console.log("start ride rideId: ", rideWithUser.RIDE_ID)
    let ride = await rideService.startRideService(rideWithUser.RIDE_ID)
    //ride = ride.recordset[0];
    let userCompleteData = await sql.query`SELECT * FROM USERS WHERE USER_ID = ${rideWithUser.USER_ID}`;
    userCompleteData = userCompleteData.recordset[0];
    userSocketId = userCompleteData.SOCKET_ID;

    let userNamespace = getUserNamespace()
     userNamespace.to(userSocketId).emit('ride-started')
     return res.status(200).json(ride);
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    console.log("rideId from End: ",rideId)
    try {
        const ride = await rideService.endRide(rideId);
        
        console.log("Ended ride: ", ride);

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}