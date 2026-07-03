import "dotenv/config";

import http from "http";
import app from "./app.js";

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("ORS_API_KEY:", process.env.ORS_API_KEY);

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
