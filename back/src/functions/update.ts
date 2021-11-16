import { Room } from "../types";

/**
 * Send room information to every room's user
 */
export default function update(io: any, room: Room) {
  const currentRoundImageIndex = room.currentRound - 1;

  io.sockets.in(room.id).emit("UPDATED", {
    id: room.id,
    users: room.users,
    category: room.category,
    currentRound: room.currentRound,
    maxRounds: room.maxRounds,
    maxTime: room.maxTime,
    chat: room.chat,
    started: room.started,
    image: room.answers[currentRoundImageIndex]?.image,
  });
}
