import { Room } from "../types";

/**
 * Return an User index from a room
 */
export default function getUserIndex(room: Room, id: number, username: string) {
  return room.users.findIndex((e) => e.username == username);
}
