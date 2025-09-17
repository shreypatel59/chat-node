const socket = io();

// Elements
const messagesContainer = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Send message
sendBtn.addEventListener("click", () => {
  const msg = input.value.trim();
  if (msg) {
    addMessage(msg, "sent");
    socket.emit("chat message", msg);
    input.value = "";
  }
});

// Enter key also sends
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Receive message
socket.on("chat message", (msg) => {
  addMessage(msg, "received");
});

// Add message to UI
function addMessage(message, type) {
  const div = document.createElement("div");
  div.classList.add("message", type);

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = message;

  if (type === "sent") {
    div.appendChild(bubble);
    div.appendChild(avatar);
  } else {
    div.appendChild(avatar);
    div.appendChild(bubble);
  }

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
