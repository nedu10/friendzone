const chatForm = document.getElementById("chat-form");

const socket = io(); //setting up connection for socket ion

socket.on("message", (message) => {
  console.log(message);
  outputMsg(message);
});

//Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

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
