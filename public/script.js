const socket = io();

let currentUser = null;
const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.querySelector("#form");
const chatInput = document.querySelector("#message");
const loginForm = document.querySelector("#login-form");
const loginScreen = document.querySelector("#login-screen");
const chatContainer = document.querySelector("#chat-container");
const chatList = document.querySelector("#chat-list");

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.querySelector("#username").value.trim();
  if (!username) return;

  currentUser = username;
  socket.emit("join", username);

  loginScreen.style.display = "none";
  chatContainer.style.display = "flex";
});

// Add user to sidebar
function addUserToSidebar(username) {
  const div = document.createElement("div");
  div.classList.add("chat-item");
  div.innerHTML = `
    <img src="https://i.pravatar.cc/40?u=${username}" alt="User">
    <div><strong>${username}</strong></div>
  `;
  chatList.appendChild(div);
}

// Add message to chat
function addMessage(message, type, userId) {
  const div = document.createElement("div");
  div.classList.add("message", type);

  const avatar = document.createElement("img");
  avatar.src = `https://i.pravatar.cc/35?u=${userId}`;
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

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (!msg) return;

  addMessage(msg, "sent", currentUser);
  socket.emit("chatMessage", { msg, user: currentUser });

  chatInput.value = "";
});

// Receive message
socket.on("chatMessage", (data) => {
  if (data.user !== currentUser) {
    addMessage(data.msg, "received", data.user);
  }
});

// When new user joins
socket.on("userJoined", (username) => {
  addUserToSidebar(username);
});
