import { io } from "socket.io-client";

const socket = io("https://uber-clone-backend-5exd.onrender.com", {
  transports: ["websocket"],
});

export default socket;
