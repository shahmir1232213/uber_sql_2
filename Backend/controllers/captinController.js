const express = require('express')
const captinModel = require('../models/captinModel')
const {validationResult} = require("express-validator")
const captinService = require('../services/captinService');
const blackListTokenModel = require('../models/blackListTokenSchema');

// got req.body from express validator
async function register(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    //destructing from req.body
    //console.log("req.body: ",req.body)
    // Create a new instance
    const {fullname,email,password,vehicle} = req.body;
    //console.log("fullname",fullname)
    //hashing password through statics function of captinModel
    const hashPassword = await captinModel.hashPassword(password);
    /* creating captin through service didn't directly use captinModel.create
    because service checks if all the fields are filled or not?*/
    
    // called captinService
    
    const captin = await captinService.createCaptin({
        firstname: fullname.firstName,
        lastname: fullname.lastName,
        email,
        password:hashPassword,
        vehicleColor:vehicle.color,
        vehiclePlate:vehicle.plate,
        vehicleType:vehicle.vehicleType,
        vehicleCpacity:vehicle.capacity
    })
    const token = captin.generateAuthToken();
      
    return res.status(201).json({token,captin,message:"captin registered"});     
}

async function login(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    let {email,password} = req.body;
    let loggedIncaptin = await captinModel.findOne({email:email}).select('+password');
    if(!loggedIncaptin){
        return res.status(401).json({error:"captin Not Found"})
    }
    else{
        //console.log("loggedIncaptin: ",loggedIncaptin)
        let isMatch = await loggedIncaptin.comparePassword(password);
        if(!isMatch)
            return res.status(401).json({error:"Incorrect Password"})
        else{
            let token = loggedIncaptin.generateAuthToken();
            res.cookie('token',token)
            // Exclude password before sending response
            loggedIncaptin.password = undefined;
            return res.status(200).json({token,loggedIncaptin,message:"Logged in sucessful"})
        }
    }
   
}
async function logout(req,res,next){
    let token = req.cookies.token || req.headers.authorization;
    let blackListToken = await blackListTokenModel.create({
        token,
        createdAt:Date.now()
    })
    res.clearCookie('token')
    return res.status(200).json({message:"logged out"})
}

function home(req,res,next){
     //console.log("captin from home req.captin: ",req.captin)
     return res.status(200).json(req.captin);
 
 }
module.exports = {
    register,
    login,
    logout,
    home
}