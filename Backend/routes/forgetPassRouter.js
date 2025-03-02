const express = require("express");
const app = express();
const router = express.Router();
const forgetPassContoller = require("../controllers/forgetPassController")

router.get("/forgot-password",forgetPassContoller.forgotPassword)
router.post("/email/verify",forgetPassContoller.verifyEmail)
router.post("/code/verify",forgetPassContoller.verifyCode)
module.exports = router;