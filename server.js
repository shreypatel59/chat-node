const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {}; // store connected users { socket.id : username }

// Serve static files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // When user joins with name
  socket.on("join", (username) => {
    users[socket.id] = username;
    console.log(`${username} joined the chat`);

    // Send updated user list to everyone
    io.emit("userList", Object.values(users));

    // Notify others
    socket.broadcast.emit("chatMessage", {
      msg: `${username} joined the chat`,
      user: "System",
    });
  });

  // Handle chat message
  socket.on("chatMessage", (data) => {
    io.emit("chatMessage", data); // broadcast to all
  });

  // When user disconnects
  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    console.log(`${username} disconnected`);

    // Update user list
    io.emit("userList", Object.values(users));

    // Notify others
    if (username) {
      socket.broadcast.emit("chatMessage", {
        msg: `${username} left the chat`,
        user: "System",
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
