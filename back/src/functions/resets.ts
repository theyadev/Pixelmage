import { ieNoOpen } from "helmet";
import { Room } from "../types";

/**
 * Reset all User answered in a room
 */
export function resetAnswer(room: Room) {
  for (let i = 0; i < room.users.length; i++) {
    room.users[i].answered = false;
  }

}

export function resetScore(room: Room) {
  for (let i = 0; i < room.users.length; i++) {
    room.users[i].score = 0;
  }
}

export function resetRoom(room: Room) {
  room.started = false;
  room.currentRound = 1;
}
