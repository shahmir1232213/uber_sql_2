const express = require ("express")
const app = express();
// const http = require("http");
const mongooseConnection = require('./db');
const userRoutes = require("./routes/userRoutes")
const isLoggedInUser = require('./middleware/isLoggedInUser')
const cookieParser = require('cookie-parser')
const captinRoutes = require('./routes/captinRoutes');
const cors = require('cors');
const mapRoutes = require('./routes/map_routes')
const rideRoutes = require('./routes/rideRoutes')
const forgetPassRouter = require("./routes/forgetPassRouter")

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use("/user",userRoutes)
// app.use("/profile",isLoggedInUser,profileRoute)
app.use('/captin',captinRoutes)
app.use('/maps', mapRoutes);
app.use('/rides',rideRoutes);
app.use("/forgot",forgetPassRouter)
module.exports = app;