import { Server } from "socket.io";
import userModel from "./models/user.model.js";
import captainModel from "./models/captain.model.js";

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      try {
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }

        if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }
      } catch (error) {
        console.log("Socket Join Error:", error);
      }
    });

    // Captain Location Update

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      try {
        await captainModel.findByIdAndUpdate(userId, {
          location: {
            ltd: location.ltd,
            lng: location.lng,
          },
        });
      } catch (error) {
        console.log("Location Update Error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

// Send Socket Event

const sendMessageToSocketId = (socketId, messageObject) => {
  if (!io || !socketId) return;

  io.to(socketId).emit(messageObject.event, messageObject.data);
};

export { initializeSocket, sendMessageToSocketId };
