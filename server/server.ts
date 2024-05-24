import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(3000);

interface Users {
  [key: string]: string;
}

const users: Users = {};

io.on("connection", (socket) => {
  // När en användare ansluter
  io.emit("message", {
    name: socket.id,
    type: "text",
    content: `Joined the chat`,
    replyMessage: undefined,
  });
  console.log("A user connected", socket.id);
  socket.on("setName", (name) => {
    users[socket.id] = name;
    io.emit("message", {
      name,
      type: "text",
      content: `has joined`,
      replyMessage: undefined,
    });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id] || "Anonymous";
    delete users[socket.id];
    io.emit("message", {
      name,
      type: "text",
      content: `has left`,
      replyMessage: undefined,
    });
  });

  socket.on("message", (message) => {
    console.log(message);
    const name = users[socket.id] || "Anonymous";
    io.emit("message", {
      name,
      type: message.type,
      content: message.content,
      replyTo: message.replyTo,
      replyMessage: undefined,
    });
  });
});

console.log("Socket.IO server running at http://localhost:3000/");
