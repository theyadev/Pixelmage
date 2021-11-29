import { Socket } from "socket.io";
import updatePublicRooms from "../functions/getPublicRooms";
import { Room } from "../types";

export default function GetPublicRooms(
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * When someone ask for Rooms
   */
  const formattedRooms = updatePublicRooms(Rooms);

  socket.emit("PUBLIC ROOMS", formattedRooms)   

  socket.on("GET PUBLIC ROOMS", async function () {});
}
