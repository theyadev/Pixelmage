import { Room } from "../types/types";

import update from "./update";
import resetAnswer from "./resetAnswer";

/**
 * Start the timer and round in a room
 */
export default function startNextRound(io: any, room: Room) {
  let i = 0;

  let interval = setInterval(() => {
    i += 0.1;

    io.sockets.in(room.id).emit("UPDATE TIMER", i);

    if (i >= room.maxTime) {
      console.log("ROUND SUIVANT !");
      room.currentRound++;
      clearInterval(interval);
      resetAnswer(room);
      update(io, room);
      if (room.maxRounds == room.currentRound) {
        return console.log("FIN DE LA PARTIE");
      } else {
        startNextRound(io, room);
      }
    }
  }, 100);
}
