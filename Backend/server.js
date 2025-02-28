require("dotenv").config();
const http = require('http')
const port = process.env.PORT;
const app = require('./app')
const server = http.createServer(app);
const { socketInitialization } = require('./sockets')
socketInitialization(server)

server.listen(port,()=>{
    console.log("Server Listening on: ",port)
}) 