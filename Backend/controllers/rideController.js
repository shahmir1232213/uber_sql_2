const rideService = require('../services/rideServices')
const {validationResult} = require('express-validator')
const mapService = require('../services/mapServices')
const {getCaptinNamespace, getUserNamespace } = require('../sockets')
const rideModel = require('../models/rideModel')

module.exports.createRide = async (req,res,next)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    let {pickup,destination,vehicleType,fare} = req.body;
    try{
       // console.log("req.user._id: ",req.user._id)
      let  pickupCoordinates = await mapService.getAddressCoordinate(pickup);
       // destinationCoordrinates = await mapService.getAddressCoordinate(destination);
        //console.log("destinantion coordinates: ",destination)
        console.log("req.user._id: ",req.user._id)
        let ride = await rideService.createRide(req.user._id,pickup,destination,vehicleType,fare)
       // console.log("pickup coordinates: ",pickupCoordinates)
        let captinRadius = await mapService.getCaptinInTheRadius(pickupCoordinates.ltd,pickupCoordinates.lng,5)
        //console.log("Captin in Radius: ",captinRadius)
        //console.log("ride: ",ride)
        const rideWithUser = await rideModel.findById(ride._id).populate('user') 
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
    const { rideId,captin } = req.body;
   // console.log("contoller req.captin: ",req.captin)
    let ride = await rideService.confirmRide(rideId,req.captin._id)
    console.log('ride with _id syntax: ',ride)
    let userNamespace = getUserNamespace()
    userNamespace.to(ride.user.socketId).emit('ride-confirmed',ride)
    return res.status(200).json(ride);
} 

module.exports.cancelRide = async (req,res,next) => {
   const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideID,message } = req.body;
   // console.log("module.exports.cancelRide rideID: ",rideID)
    let ride = await rideService.cancelRide(rideID,message);
    return res.status(200).json(ride);
}

module.exports.startRide = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    console.log("start ride rideId: ",rideId)
    let ride = await rideService.startRideService(rideId);
    // console.log("started ride: ",ride)
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
        console.log("Ended ride: ",ride)
        // sendMessageToSocketId(ride.user.socketId, {
        //     event: 'ride-ended',
        //     data: ride
        // })
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}