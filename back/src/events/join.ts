import { Socket } from "socket.io";
import { Room } from "../types";

export default function Join(socket: Socket, Rooms: Map<number, Room>) {
  /**
   * When someone join a room
   */
  socket.on("JOIN", function (data) {
    if (!data.id || !data.name) return;

    const room = Rooms.get(data.id);

    // If room doesn't exist
    if (!room) {
      return socket.emit("ERROR", {
        error: "Game doesn't exist !",
      });
    }

    console.log(`${room.id} -> ${data.name} -> JOINING !`);

    // If username already in the room
    if (room.users.some((user) => user.username == data.name)) {
      return socket.emit("ERROR", {
        error: "Username already taken !",
      });
    }

    // If room is full
    if (room.users.length >= 20) {
      return socket.emit("ERROR", {
        error: "Game is full !",
      });
    }

    // Add the user in the room
    room.users.push({
      username: data.name,
      score: 0,
      answered: false,
      host: false,
      color: "",
    });

    socket.join(data.id);
    socket.emit("JOINED");
  });
}
