require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1/chat_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error(err));

// API endpoint to get last messages
app.get("/messages", async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 }).limit(50);
  res.json(msgs.reverse());
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (username) => {
    socket.username = username;
    socket.broadcast.emit("userJoined", { username });
  });

  socket.on("sendMessage", async (data) => {
    const msg = new Message({ username: data.username, text: data.message });
    await msg.save();
    io.emit("newMessage", msg); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
