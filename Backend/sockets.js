const socketIO = require('socket.io');
const cors = require('cors');
const userModel = require('./models/userModels');
const captinModel = require('./models/captinModel');

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
      let user = await userModel.findByIdAndUpdate(
        userId,
        { socketId: socket.id },
        { new: true }
      );
      console.log("updated user: ", user);
    });

    socket.on('disconnect', async () => {
      console.log("user disconnected: ", socket.id);
    });
  });

   captinNamespace = io.of('/captin');
  captinNamespace.on('connection', async (socket) => {
    console.log("captin connected: ", socket.id);

    socket.on('join', async (captinId) => {
     // console.log("captin_id: ",captinId)
      console.log("captin joined")
      let captin = await captinModel.findByIdAndUpdate(
        captinId,
        { socketId: socket.id },
        { new: true }
      );
     // console.log("updated captin: ", captin);
    });
    socket.on('update-location-captin',async (data)=>{
     // console.log("location: ",data)
      let captin = await captinModel.findByIdAndUpdate(
                          data.captinId,
                          { 
                            location:{
                              latitude:data.location.ltd,
                              longitude:data.location.lng
                            }  
                          },
                          { new: true }
                    );
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
