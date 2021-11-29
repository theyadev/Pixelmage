import { getCategories } from "../db";
import { Room } from "../types";
import capitalize from "./capitalize";
import { everyoneAnswered } from "./startNextRound";

function formatAnswer(text: string) {
  return text.replace("_", " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[a-zA-Z0-9]/g, "_")
}

/**
 * Send room information to every room's user
 */
export default async function update(io: any, room: Room) {
  const currentRoundImageIndex = room.currentRound - 1;

  const currentAnswer = room.answers[currentRoundImageIndex]

  const categories = await getCategories()

  io.sockets.in(room.id).emit("UPDATED", {
    id: room.id,
    users: room.users,
    categories: room.categories,
    currentRound: room.currentRound,
    maxRounds: room.maxRounds,
    maxTime: room.maxTime,
    chat: room.chat,
    roundEnded: room.roundEnded,
    showLeaderboard: room.showLeaderboard,
    started: room.started,
    answer: currentAnswer ? everyoneAnswered(room) ? currentAnswer.answer : formatAnswer(currentAnswer.answer) : "",
    category: room.showCategories && currentAnswer? capitalize(categories.filter(e => e.id == currentAnswer.categoryId)[0].category) : "",
    image: currentAnswer? currentAnswer.url : undefined,
  });
}
