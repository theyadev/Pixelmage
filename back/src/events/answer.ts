import { Socket } from "socket.io";
import { Room } from "../types";

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
      data.answer.toLowerCase() ==
        room.answers[currentRoundImageIndex].answer.toLowerCase() ||
      room.answers[currentRoundImageIndex].aliases?.some(
        (e) => e.toLowerCase() == data.answer.toLowerCase()
      )
    ) {
      const index = getUserIndex(room, data.id, data.name);

      if (index === -1) return;

      room.users[index].answered = true;

      const max = 1000;
      const min = 100;

      room.users[index].score +=
        Math.floor(
          ((1 - room.currentTime / room.maxTime) * (max - min) + min) / 10
        ) * 10;

      socket.emit("GOOD ANSWER");

      update(io, room);
    } else {
      socket.emit("WRONG ANSWER");
    }
  });
}
