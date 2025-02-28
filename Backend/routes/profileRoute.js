const express = require('express')
const router = express.Router();
const userProfile = require("../controllers/user_profile")

router.get('/',()=>{console.log("reached")})

module.exports = router;