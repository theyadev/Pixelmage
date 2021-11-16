import { Room } from "../types";

import update from "./update";
import resetAnswer from "./resetAnswer";
import { ieNoOpen } from "helmet";

/**
 * Start the timer and round in a room
 */
export default function startNextRound(io: any, room: Room) {
  let i = 0;

  let interval = setInterval(() => {
    i += 0.1;

    io.sockets.in(room.id).emit("UPDATE TIMER", i);

    if (i >= room.maxTime) {
      console.log("REPONSE AFFICHEE !");
      clearInterval(interval);
      resetAnswer(room);
      update(io, room);
      endRound(io, room);
    }
  }, 100);
}

export function endRound(io: any, room: Room){
  let i = 0;
  
  let interval = setInterval(() => {
    i += 0.25;

    io.sockets.in(room.id).emit("UPDATE TIMER", i);

    if (i >= room.maxTime) {
      console.log("ROUND SUIVANT !");
      console.log(room.maxRounds)
      room.currentRound++;
      clearInterval(interval);
      resetAnswer(room);
      update(io, room);
      if (room.maxRounds == room.currentRound) {
        io.sockets.in(room.id).emit("QUIT TO LOBBY");
        return console.log("FIN DE LA PARTIE");        
      } else {
        startNextRound(io, room);
      }
    }
  }, 100);
}
