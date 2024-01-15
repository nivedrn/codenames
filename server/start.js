const app = require("./server.js");
const http = require("http");
const socketio = require("socket.io");
const PORT = process.env.PORT || 8080;
const connectDB = require("./config/db.js");
const mongoose = require("mongoose");

// Connect to DB
mongoose.set("strictQuery", true);
connectDB();

connectDB();

// -------------------------- SERVER ---------------------------- //
const server = http.createServer(app);

//Start server only after connection to Database has established without errors
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
    console.log("Error Connecting to MongoDB");
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
});

// ------------------------- SOCKET.IO ------------------------- //
const io = socketio(server, {
  cors: { origin: "*" },
});

require("./controllers/socketController.js")(io);
