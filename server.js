const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

// Setup socket.io with CORS allowed
const io = new Server(server, {
  cors: { origin: "*" }
});

// Serve static files from "public" folder
app.use(express.static("public"));

// Handle socket connections
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

// Use Render's PORT or 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});