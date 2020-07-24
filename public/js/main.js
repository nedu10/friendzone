const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io(); //setting up connection for socket ion

socket.on("message", (message) => {
  console.log(message);
  outputMsg(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
  socket.emit("chatMessage", msg);
});

function outputMsg(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">Brad <span>9:12pm</span></p>
            <p class="text">
              ${message}
            </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}
