const captinModel = require('../models/captinModel')

async function createCaptin({firstname,lastname,email,password,vehicleColor,vehiclePlate,vehicleCpacity,vehicleType}){
    if(!firstname||!lastname||!email||!password||!vehicleColor||!vehiclePlate){
        console.log("vehileColor: ",vehicleColor)
        console.log("vehilePlate: ",vehiclePlate)
        throw new Error("All fields must be filled")
    }    
    else{
        let captin = await captinModel.create({
            fullName:{
                firstName:firstname,
                lastName:lastname
            },
            email:email,
            password:password,
            vehicle:{
                color:vehicleColor,
                plate:vehiclePlate,
                capacity:vehicleCpacity,
                vehicleType:vehicleType,
            }
        })
        return captin;
    }
}

module.exports = {
    createCaptin
}