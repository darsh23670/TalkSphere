import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http"; // to connect socket server and express
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.route.js";

const app = express();
const server = createServer(app); //Passes in the Express app (app) so both Express routes and WebSockets can share the same server.
const io = connectToSocket(server); // Creates a Socket.IO server attached to the HTTP server.This allows clients to connect via WebSocket while still using the same server as Express. Now both normal API requests (REST via Express) and real-time connections (WebSocket via Socket.IO) work together.Move it to controllers
app.set("port", process.env.PORT || 8000); //Sets the server port:First tries process.env.PORT (used when hosting on services like Heroku, Render, etc.).Falls back to 8000 if no environment variable is provided.

app.use(cors());
app.use(express.json({ limit: "40kb" })); //Parse json data
app.use(express.urlencoded({ limit: "40kb", extended: true })); //

app.use("/api/v1/users", userRoutes);

const start = async () => {
  app.set("mongo_user");
  const connectionDb = await mongoose.connect(
    "mongodb+srv://xxxxx:xxxxx@cluster0.0ap2fwm.mongodb.net/"
  );
  console.log(`MONGO Connected : ${connectionDb.connection.host}`); //gives the hostname of the MongoDB server your app is connected to.
  server.listen(app.get("port"), () => {
    //Starts the HTTP + WebSocket server on the defined port.
    console.log("Listening on port 8000");
  });
};

start();
