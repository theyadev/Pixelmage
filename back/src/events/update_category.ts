import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";

export default function UpdateCategory(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * Change the category
   */
  socket.on("UPDATE CATEGORY", function (data) {
    if (!data.categories || !data.id) return;

    const room = Rooms.get(data.id);

    if (!room) return;

    console.log(`${room.id} -> UPDATE CATEGORY !`);

    room.categories = data.categories;

    update(io, room);
  });
}
