const socket = io(); // Connect to server
const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.querySelector("form");
const chatInput = document.querySelector("#message");

// Function to add a message to chat
function addMessage(message, type, userId) {
  const div = document.createElement("div");
  div.classList.add("message", type);

  // Avatar
  const avatar = document.createElement("div");
  avatar.classList.add("avatar");

  // 🎨 Optional: give each user a unique color
  if (userId) {
    const colors = ["#f54242", "#4287f5", "#42f57b", "#f5a742", "#9b42f5"];
    let color = colors[userId.charCodeAt(0) % colors.length];
    avatar.style.background = color;
  }

  // Bubble
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = message;

  // Order (sent: bubble first, received: avatar first)
  if (type === "sent") {
    div.appendChild(bubble);
    div.appendChild(avatar);
  } else {
    div.appendChild(avatar);
    div.appendChild(bubble);
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight; // auto scroll
}

// Send message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (!msg) return;

  // Show my message
  addMessage(msg, "sent", "me");

  // Send to server
  socket.emit("chatMessage", msg);

  chatInput.value = "";
  chatInput.focus();
});

// Receive message
socket.on("chatMessage", (data) => {
  addMessage(data.msg, "received", data.userId || "other");
});
