import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";
import getUserIndex from "../functions/getUserIndex";


export function levenshteinDistance(str1 = '', str2 = ''){
  const track = Array(str2.length + 1).fill(null).map(() =>
  Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
     track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
     track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
     for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
           track[j][i - 1] + 1, // deletion
           track[j - 1][i] + 1, // insertion
           track[j - 1][i - 1] + indicator, // substitution
        );
     }
  }
  return (str1.length+str2.length - track[str2.length][str1.length])/(str1.length+str2.length);
};

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

    const percentAccepted = 0.5;
    const percentNear = 0.8;

    if (!room) return;

    const currentRoundImageIndex = room.currentRound - 1;


    if (
      levenshteinDistance(data.answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
        room.answers[currentRoundImageIndex].answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) >= percentAccepted ||
      room.answers[currentRoundImageIndex].aliases?.some(
        (e) => levenshteinDistance(e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), data.answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) >= percentAccepted
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
    }
    else if (
      levenshteinDistance(data.answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
        room.answers[currentRoundImageIndex].answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) >= percentNear ||
      room.answers[currentRoundImageIndex].aliases?.some(
        (e) => levenshteinDistance(e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), data.answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) >= percentNear
      )
    ){
      socket.emit("WRONG ANSWER"); // A CHANGER "NEAR ANSWER"
    } else {
      socket.emit("WRONG ANSWER");
    }
  });
}


