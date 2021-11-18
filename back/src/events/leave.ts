import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";
import getUserIndex from "../functions/getUserIndex";

export default function Leave(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * When a user leave a room
   */
  socket.on("LEAVE", function (data) {
    if (!data.name || !data.id) return;

    const room = Rooms.get(data.id);

    // If room doesn't exist
    if (!room) return;

    console.log(`${room.id} -> ${data.name} -> LEAVING !`);

    // Get the index of the user who is quitting
    const index = getUserIndex(room, data.id, data.name);

    // If user not found in the room
    if (index === -1) return;

    // Remove the user from the room
    const user = room.users.splice(index, 1)[0];

    socket.leave(data.id)

    // If the leaving user is host, pass the host to the next player
    if (user.host == true) {
      // Is there's no one in the room, close the game
      if (room.users.length == 0) {
        Rooms.delete(data.id);
        return;
      }
      room.users[0].host = true;
    }

    update(io, room);
  });
}
