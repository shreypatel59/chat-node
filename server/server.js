require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.get('/messages', async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: 1 }).limit(200);
  res.json(msgs);
});

app.post('/message', async (req, res) => {
  const { from, to, text } = req.body;
  const msg = new Message({ from, to, text });
  await msg.save();
  res.json(msg);
});

io.on('connection', (socket) => {
  console.log('user connected', socket.id);

  socket.on('join', async (name) => {
    await User.findOneAndUpdate({ name }, { socketId: socket.id }, { upsert: true });
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('chat-message', async (data) => {
    const msg = new Message({ from: data.user, text: data.msg });
    await msg.save();
    io.emit('chat-message', { user: data.user, msg: data.msg, createdAt: msg.createdAt });
  });

  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.id);
    await User.findOneAndUpdate({ socketId: socket.id }, { $unset: { socketId: "" }});
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
