import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";

export default function UpdateMaxTime(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * Change the max time
   */
  socket.on("UPDATE MAX TIME", function (data) {
    if (!data.maxTime || !data.id) return;

    const room = Rooms.get(data.id);

    if (!room) return;

    console.log(`${room.id} -> UPDATE MAX TIME !`);

    room.maxTime = data.maxTime;
    update(io, room);
  });
}
