const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("✅ A user connected");

  socket.on("chat message", (msg) => {
    // msg is now an object: { username: "...", text: "..." }
    console.log(`💬 Message from ${msg.username}: ${msg.text}`);
    // Broadcast the entire message object
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});