import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";

export default function UpdateMaxRounds(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * Change the max rounds
   */
  socket.on("UPDATE MAX ROUNDS", function (data) {
    if (!data.maxRounds || !data.id) return;

    console.log("UPDATE MAX ROUNDS");

    const room = Rooms.get(data.id);

    if (!room) return;

    room.maxRounds = data.maxRounds;

    update(io, room);
  });
}
