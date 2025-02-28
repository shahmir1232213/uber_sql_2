const userModel = require('../models/userModels')

async function createUser({email,password,firstname,lastname}){
    if(!email || !firstname ||!lastname ||!password){
        throw new Error("All fields must be filled")
    }
    else{
        const user = await userModel.create({
            fullName:{
                firstName:firstname,
                lastName:lastname
            },
            email:email,
            password:password
        })
        return user;
    }
}

module.exports = {
    createUser
}