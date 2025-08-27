//app.js (or server.js) should mainly focus on starting the app (Express routes, DB connection, etc.).Socket.IO logic is a separate responsibility, so you move it into its own file.
import { Server } from "socket.io";

let connections = {}; //connections: Keeps track of which users (socket IDs) are in which call "room" (path).
let messages = {}; // messages: Stores chat history for each room so that new users can see older messages.
let timeOnline = {}; //timeOnline: Tracks when each socket joined (for analytics/cleanup).

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //socket represents that client; it has a unique socket.id.

    //Joining a call
    socket.on("join-call", (path) => {
      //path->room id or call id
      if (connections[path] == undefined) {
        //Client emits join-call with some identifier (path = call ID or room ID).If the room doesn’t exist yet, create an empty list for it.Add this user’s socket ID to that room’s list.Save the time they joined
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit("user-joined", socket.id);
      }

      //Send chat history
      if (messages[path] != undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });

    // WebRTC signalling
    socket.on("signal", (told, message) => {
      //signal is used for WebRTC peer-to-peer setup.
      io.to(told).emit("signal", socket.id, message); //Example: Alice sends her SDP offer/ICE candidate to Bob.told = Bob’s socket ID.message = WebRTC data
    });

    //Chat Messages
    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        //So Object.entries(connections) → [ ["room1", ["socketA","socketB"]], ["room2", ["socketC"]] ].We then use .reduce() to find which room this socket.id belongs to.
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );
      if (found == true) {
        if (messages[matchingRoom] == undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("message", key, ":", sender, data);
        connections[matchingRoom].forEach((elm) => {
          io.to(elm).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    //Disconnect
    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date()); //timeOnline[socket.id] was saved when the user joined (timeOnline[socket.id] = new Date()).This calculates how long the user was connected by subtracting join time from now.

      var key;
      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections))
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] == socket.id) {
            key = k;

            for (let a = 0; a < connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }
            var index = connections[key].indexOf(socket.id);
            connections[key].splice(index, 1);

            if (connections[key].length == 0) {
              delete connections[key];
            }
          }
        }
      }
    });
  });

  return io;
};
