import { Room } from "../types";

import update from "./update";
import { resetAnswer, resetScore, resetRoom } from "./resets";


function everyoneAnswered(room: Room) {
  return room.users.every(e => e.answered)
}

/**
 * Start the timer and round in a room
 */
export default function startNextRound(io: any, room: Room) {
  let i = 0;

  let interval = setInterval(() => {
    i += 0.1;

    room.currentTime = i

    io.sockets.in(room.id).emit("UPDATE TIMER", i);

    if (everyoneAnswered(room)) {
      clearInterval(interval);
      endRound(io, room);
      return
    }

    if (i >= room.maxTime) {
      clearInterval(interval);
      endRound(io, room);
    }
  }, 100);
}

export function endRound(io: any, room: Room) {
  let i = 0;

  resetAnswer(room, true)

  update(io, room)

  let interval = setInterval(() => {
    i += room.maxTime / 50 ;

    io.sockets.in(room.id).emit("UPDATE TIMER", i, true);

    if (i >= room.maxTime) {
      clearInterval(interval);

      room.currentRound++;

      resetAnswer(room, false);

      update(io, room);

      if (room.maxRounds <= room.currentRound - 1) {
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
