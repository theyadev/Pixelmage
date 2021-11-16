import { Room } from "../types";

import update from "./update";
import { resetAnswer, resetScore, resetRoom } from "./resets";

/**
 * Start the timer and round in a room
 */
export default function startNextRound(io: any, room: Room) {
  let i = 0;

  let interval = setInterval(() => {
    i += 0.1;

    io.sockets.in(room.id).emit("UPDATE TIMER", i);

    if (i >= room.maxTime) {
      clearInterval(interval);
      endRound(io, room);
    }
  }, 100);
}

export function endRound(io: any, room: Room) {
  let i = 0;

  let interval = setInterval(() => {
    i += 0.25;

    io.sockets.in(room.id).emit("UPDATE TIMER", i);

    if (i >= room.maxTime) {
      room.currentRound++;

      clearInterval(interval);

      resetAnswer(room);

      update(io, room);

      if (room.maxRounds <= room.currentRound) {
        resetRoom(room);
        resetScore(room);

        console.log(`${room.id} -> FIN DE LA PARTIE !`);

        return io.sockets.in(room.id).emit("QUIT TO LOBBY");
      } else {
        console.log(`${room.id} -> ROUND SUIVANT !`);
        
        startNextRound(io, room);
      }
    }
  }, 100);
}
