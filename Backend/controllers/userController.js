const express = require('express')
const userModel = require('../models/userModels')
const {validationResult} = require("express-validator")
const userService = require('../services/userService');
const blackListTokenModel = require('../models/blackListTokenSchema');

// got req.body from express validator
async function register(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    //destructing from req.body
    console.log("req.body: ",req.body)
    // Create a new instance
    const {fullname,email,password} = req.body;
    //hashing password through statics function of userModel
    const hashPassword = await userModel.hashPassword(password);
    /* creating user through service didn't directly use userModel.create
    because service checks if all the fields are filled or not?*/
    
    // called userService
    const user = await userService.createUser({
        firstname: fullname.firstName,
        lastname: fullname.lastName,
        email,
        password:hashPassword
    })
    const token = user.generateAuthToken();
      
    return res.status(201).json({token,user});     
}

async function login(req,res,next){
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    let {email,password} = req.body;
    let loggedInUser = await userModel.findOne({email:email}).select('+password');
    if(!loggedInUser){
        return res.status(401).json({error:"User Not Found"})
    }
    else{
        //console.log("loggedInUser: ",loggedInUser)
        let isMatch = await loggedInUser.comparePassword(password);
        if(!isMatch)
            return res.status(401).json({error:"Incorrect Password"})
        else{
            let token = loggedInUser.generateAuthToken();
            res.cookie('token',token)
            return res.status(200).json({token,message:"Logged in sucessful"})
        }
    }
   
}

async function logout(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Logout reached BACKEND: ",token)
   try{
        let blackListToken = await blackListTokenModel.create({
            token,
            createdAt:Date.now()
        })
        res.clearCookie('token')
        return res.status(201).json({message:"logged out"})
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