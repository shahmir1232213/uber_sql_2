const express = require('express')
const userModel = require('../models/userModels')
const {validationResult} = require("express-validator")
const userService = require('../services/userService');
const blackListTokenModel = require('../models/blackListTokenSchema');
const sql = require('mssql/msnodesqlv8');

async function register(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    const {fullname,email,password} = req.body;

    const hashPassword = await userService.hash_Password(password);
   
    let result = await sql.query`insert into  USERS (FIRST_NAME,LAST_NAME,EMAIL,PASSWORD)
                                OUTPUT INSERTED.*
                                values(${fullname.firstName},${fullname.lastName},${email},${hashPassword})`
    
    let registeredUser = result.recordset[0];                            
    console.log("Inserted User: ",registeredUser)
    const token = userService.generateAuthToken(registeredUser);
    res.cookie('token',token)
    return res.status(201).json({token,message:"Registered user Sucessfuly"});     
}

async function login(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    let {email,password} = req.body;
   // let loggedInUser = await userModel.findOne({email:email}).select('+password');
      let loggedInUser = await sql.query`SELECT * FROM USERS WHERE EMAIL = ${email}`;
        loggedInUser = loggedInUser.recordset[0];
        //console.log("user found logged in: ",loggedInUser)
      if(!loggedInUser){
        return res.status(401).json({error:"User Not Found"})
    }
    else{
        //console.log("loggedInUser: ",loggedInUser)
        let isMatch = await userService.compare_Password(loggedInUser,password);
        if(!isMatch)
            return res.status(401).json({error:"Incorrect Password"})
        else{
            let token = userService.generateAuthToken(loggedInUser);
            //req.USER_ID = loggedInUser.USER_ID;
           // console.log("Token Sent Sucessfuly: ",token)
            return res.status(200).json({loggedInUser,token,message:"Logged in sucessful"})
        }
    }
   
}

async function logout(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    //console.log("token reached banckend: ",token)
    try{
        await sql.query`
           insert into BLACKLIST_TOKENS (TOKEN)
            values ('${token}')`;
        res.clearCookie('token')
       // console.log("logged out bhaiyua")
        return res.status(200).json({message:"logged out"})
    }
    catch(err){
            return res.status(500).json({ message: "Internal server error" });
    }
}

function home(req,res,next){
   // console.log("user from home req.user: ",req.user)
    return res.status(200).json(req.user);

}

module.exports = {
    register,
    login,
    logout,
    home
}