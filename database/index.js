const mongoose = require("mongoose");
const { dbUser, dbPass, dbHost, dbPort, dbName } = require("../app/config");
mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`);
const db = mongoose.connection;
// db.on("open", async function () {
//   try {
//     server.listen(port);
//   } catch (err) {
//     server.on("error", err);
//   }

//   server.on("listening", onListening);
//   console.log("database running");
// });

module.exports = db;
