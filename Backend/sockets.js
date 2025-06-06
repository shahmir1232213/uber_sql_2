const socketIO = require('socket.io');
const cors = require('cors');
//const userModel = require('./models/userModels');
//const captinModel = require('./models/captinModel');
const sql = require('mssql/msnodesqlv8');

let captinNamespace;
let userNamespace;
function socketInitialization(server){
  let io = new socketIO.Server(server, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST']
    }
  });

  userNamespace = io.of('/user');
  userNamespace.on('connection', async (socket) => {
    console.log("user connected: ", socket.id);

    socket.on('join', async (userId) => {
      console.log("updated user: ", userId);
      let user = await sql.query`UPDATE USERS SET SOCKET_ID = ${socket.id} WHERE USER_ID = ${userId}`;
      
    });

    socket.on('disconnect', async () => {
      console.log("user disconnected: ", socket.id);
    });
  });

   captinNamespace = io.of('/captin');
  captinNamespace.on('connection', async (socket) => {
    console.log("captin connected: ", socket.id);

    socket.on('join', async (captinId) => {
     console.log("updated captin: ",captinId );
      console.log("captin joined")
     let user = await sql.query`UPDATE CAPTIN SET SOCKET_ID = ${socket.id} WHERE CAPTIN_ID = ${captinId}`;
     // console.log("updated captin: ", captin);
    });
    socket.on('update-location-captin',async (data)=>{
     // console.log("location: ",data)
     await sql.query`
            UPDATE CAPTIN
            SET LONGITUDE = ${data.location.lng},
                LATITUDE = ${data.location.ltd}
            WHERE CAPTIN_ID = ${data.captinId}`;
    //  console.log("captin after: ",captin)
     })
    socket.on('disconnect', async () => {
      console.log("captin disconnected: ", socket.id);
    });
  });
};
function getCaptinNamespace() {
  if (!captinNamespace) {
    throw new Error("captinNamespace is not initialized. Call socketInitialization() first.");
  }
  return captinNamespace;
}
function getUserNamespace() {
  if (!userNamespace) {
    throw new Error("userNamespace is not initialized. Call socketInitialization() first.");
  }
  return userNamespace;
}
module.exports = {
  socketInitialization,
  getCaptinNamespace,
  getUserNamespace
};
