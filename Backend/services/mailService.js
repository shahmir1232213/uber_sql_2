const nodeMailer = require("nodemailer");

async function sendEmail(to,subject,text){
    const transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user:"shahmir.siddiqui.b@gmail.com",
            pass:"iauc wnal gtxa srel"
        },
    })
    const mailOption = {
        from:"shahmir.siddiqui.b@gmail.com",
        to:to,
        subject:subject,
        text:text
    }
    try{
    let info = await transporter.sendMail(mailOption);
    console.log("Email Sent: ", info.response)
    }catch(err){
        console.log("Error:",err)
    }
    
}

module.exports = sendEmail;
