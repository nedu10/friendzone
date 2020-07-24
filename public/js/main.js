const chatForm = document.getElementById("chat-form");

const socket = io(); //setting up connection for socket ion

socket.on("message", (message) => {
  console.log(message);
});

//Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //   console.log("showing msg >> ", msg);

  //emittin to the server
  socket.emit("chatMessage", msg);
});
