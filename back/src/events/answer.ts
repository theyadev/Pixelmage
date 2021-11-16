import { Socket } from "socket.io";
import { Room } from "../types/types";

import update from "../functions/update";
import getUserIndex from "../functions/getUserIndex";

export default function Answer(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * When someone submit an answer
   */
  socket.on("ANSWER", function (data) {
    const room = Rooms.get(data.id);

    if (!room) return;

    const currentRoundImageIndex = room.currentRound - 1;
    if (
      data.answer.toLowerCase() == room.answers[currentRoundImageIndex].name ||
      room.answers[currentRoundImageIndex].aliases.includes(
        data.answer.toLowerCase()
      )
    ) {
      const index = getUserIndex(room, data.id, data.name);

      if (index === undefined) return;

      room.users[index].answered = true;

      room.users[index].score++;

      socket.emit("GOOD ANSWER");

      update(io, room);
    } else {
      socket.emit("WRONG ANSWER");
    }
  });
}
