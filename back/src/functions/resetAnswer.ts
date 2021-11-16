import { Room } from "../types/types";

/**
 * Reset all User answered in a room
 */
export default function resetAnswer(room: Room) {
  for (let i = 0; i < room.users.length; i++) {
    room.users[i].answered = false;
  }
}
