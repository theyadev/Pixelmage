import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";

export default function UpdateShowCategories(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * Change the max rounds
   */
  socket.on("UPDATE SHOW CATEGORIES", function (data) {
    if (!data.id) return;

    const room = Rooms.get(data.id);

    if (!room) return;

    console.log(`${room.id} -> UPDATE SHOW CATEGORIES !`);

    room.showCategories = data.showCategories
    update(io, room);
  });
}
