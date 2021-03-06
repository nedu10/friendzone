const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

const socket = io(); //setting up connection for socket ion

// fetch all former messages
// socket.emit("fetchRoomHistory", { room });

// user join room
socket.emit("joinRoom", { username, room });

socket.on("message", (message) => {
  console.log(message);
  outputMsg(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();

  //   console.log("showing msg >> ", msg);

  //emittin to the server
  socket.emit("chatMessage", { msg, username, room });
});

function outputMsg(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${
      message.bot_name == username ? "Me" : message.bot_name
    } <span>${message.timeStamp}</span></p>
            <p class="text">
              ${message.message}
            </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  console.log("here");
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.user_id.username}</li>`).join("")}
  `;
}
