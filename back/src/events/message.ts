import { Socket } from "socket.io";
import { Room } from "../types";

export default function Message(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * When someone send a message in the chat
   */
  socket.on("MESSAGE", function (data) {
    const room = Rooms.get(data.id);

    if (!room) return;

    const message = {
      author: data.username,
      content: data.message,
      date: new Date(),
    };

    room.chat.push(message);

    io.sockets.in(data.id).emit("CHAT", room.chat);
  });
}
