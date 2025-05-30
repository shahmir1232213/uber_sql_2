const express = require('express')
const captinModel = require('../models/captinModel')
const {validationResult} = require("express-validator")
const captinService = require('../services/captinService');
const blackListTokenModel = require('../models/blackListTokenSchema');
const sql = require('mssql/msnodesqlv8');

// got req.body from express validator
async function register(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    //destructing from req.body
   // console.log("req.body: ",req.body)
    // Create a new instance
    const {fullname,email,password,vehicle} = req.body;
    //hashing password 
    const hashPassword = await captinService.hash_Password(password);
    try{
       var registeredCaptin = await sql.query`
        EXEC REGISTER_CAPTIN_PROCEDURE 
            @FIRST_NAME = ${fullname.firstName},
            @LAST_NAME = ${fullname.lastName},
            @EMAIL = ${email},
            @PASSWORD = ${hashPassword},
            @NUMBER_PLATE = ${vehicle.plate},
            @COLOR = ${vehicle.color},
            @CAPACITY = ${vehicle.capacity},
            @VEHICLE_TYPE = ${vehicle.vehicleType}`;
    }
    catch(err){
        console.log("Error: ",err)
    }
     console.log("CAPTIN INSERTED: ",registeredCaptin)
    registeredCaptin = registeredCaptin.recordset[0]
   
    const token = captinService.generateAuthToken(registeredCaptin);
    return res.status(201).json({token,message:"captin registered"});     
}

async function login(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    let {email,password} = req.body;
    //let loggedIncaptin = await captinModel.findOne({email:email}).select('+password');
    let loggedIncaptin = await sql.query`SELECT * FROM CAPTIN WHERE EMAIL = ${email}`;
    //console.log("loggedIncaptin: ",loggedIncaptin)
    loggedIncaptin = loggedIncaptin.recordset[0];
    if(!loggedIncaptin){
        return res.status(401).json({error:"captin Not Found"})
    }
    else{
        //console.log("loggedIncaptin: ",loggedIncaptin)
        let isMatch = await captinService.compare_Password(loggedIncaptin,password);
        if(!isMatch)
            return res.status(401).json({error:"Incorrect Password"})
        else{
            let token = captinService.generateAuthToken(loggedIncaptin);
            res.cookie('token',token)
            // Exclude password before sending response
            loggedIncaptin.password = undefined;
            console.log("loggedIncaptin: ",loggedIncaptin)
            req.CAPTIN_ID = loggedIncaptin. CAPTIN_ID;
            return res.status(200).json({token,loggedIncaptin,message:"Logged in sucessful"})
        }
    }
   
}
async function logout(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
   // console.log("bhaiya captin id yahan: ",req.CAPTIN_ID)
    //console.log("token reached banckend: ",token)
    try{
        await sql.query`
           insert into BLACKLIST_TOKENS (TOKEN)
            values ('${token}')`;
        res.clearCookie('token')
      //  console.log("logged out bhaiyua")
        return res.status(200).json({message:"logged out"})
    }
    catch(err){
            return res.status(500).json({ message: "Internal server error" });
    }
}

function home(req,res,next){
     //console.log("captin from home req.captin: ",req.captin)
     return res.status(200).json(req.captin);
 
 }

 async function setting(req,res,next){
    let captins = await captinModel.find();
    //console.log("captin: ",captins)
    return res.status(200).json(captins);
    // let captins2 = await captinModel.findOneAndUpdate(
    //     {_id:'67c414144ecd0ba1cbc751c0'},
    //     {
    //         $set:{
    //             "location.latitude":24.8361159,
    //             "location.longitude":67.0837996
    //         }
    //     },
    //     {new:true}
    // )
    // console.log("captins after: ", captins2);
  }
module.exports = {
    register,
    login,
    logout,
    home,
    setting
}