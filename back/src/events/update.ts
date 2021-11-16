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

    console.log("UPDATING");

    const room = Rooms.get(data.id);

    // If room doesn't exist
    if (!room) return;

    update(io, room);
  });
}
