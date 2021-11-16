import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";

export default function Update(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * When someone update data for everyone
   */
  socket.on("UPDATE", function (data) {
    if (!data.id) return;

    const room = Rooms.get(data.id);
    
    // If room doesn't exist
    if (!room) return;

    console.log(`${room.id} -> UPDATING PLAYERS !`);

    update(io, room);
  });
}
