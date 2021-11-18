import { Socket } from "socket.io";
import { Answer, Room } from "../types";

import update from "../functions/update";
import getUserIndex from "../functions/getUserIndex";

import levenshtein from "../functions/levensthein";

function completeNormalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function checkAnswer(
  userAnswer: string,
  roomAnswer: Answer,
  minPercentage: number
) {
  return (
    levenshtein(
      completeNormalize(userAnswer),
      completeNormalize(roomAnswer.answer)
    ) >= minPercentage ||
    roomAnswer.aliases?.some(
      (e) =>
        levenshtein(completeNormalize(e), completeNormalize(userAnswer)) >=
        minPercentage
    )
  );
}

function calculateScore(currentTime: number, maxTime: number) {
  const max = 1000;
  const min = 100;

  return (
    Math.floor(((1 - currentTime / maxTime) * (max - min) + min) / 10) * 10
  );
}

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

    const percentAccepted = 80;
    const percentNear = 65;

    if (!room) return;

    const currentRoundAnswer = room.answers[room.currentRound - 1];

    if (checkAnswer(data.answer, currentRoundAnswer, percentAccepted)) {
      const index = getUserIndex(room, data.id, data.name);

      if (index === -1) return;

      room.users[index].answered = true;

      room.users[index].score += calculateScore(room.currentTime, room.maxTime);

      socket.emit("GOOD ANSWER");

      update(io, room);
    } else if (checkAnswer(data.answer, currentRoundAnswer, percentNear)) {
      socket.emit("NEAR ANSWER");
    } else {
      socket.emit("WRONG ANSWER");
    }
  });
}
