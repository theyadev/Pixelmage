import { Socket } from "socket.io";
import { Room } from "../types/types";

import getUserIndex from "../functions/getUserIndex";

export default function ChangeColor(socket: Socket, Rooms: Map<number, Room>) {
  /**
   * Change the color
   */

  socket.on("CHANGE COLOR", function (data) {
    const room = Rooms.get(data.id);

    if (!room) return;

    const index = getUserIndex(room, data.id, data.name);

    room.users[index].color = data.color;
  });
}
