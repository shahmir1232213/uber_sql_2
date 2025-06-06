const express = require ("express")
const app = express();
// const http = require("http");
const connectToSQLServer = require('./sql');
//const mongooseConnection = require('./db');
//const sql = require('mssql/msnodesqlv8');

// async function main() {
//     await connectToSQLServer(); // Wait for connectio
//     //const insert = await sql.query`INSERT INTO watch (id,Name1) values (3,'shumaila')`;
//     const result = await sql.query`SELECT * FROM watch`;
//     console.table(result.recordset);
// }
// main()

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