import { Server, Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";
import { resetAnswer, resetScore, resetLeaderboard } from "../functions/resets";
import startNextRound from "../functions/startNextRound";
import { getImages } from "../db";
import getPublicRooms from "../functions/getPublicRooms";

type Category = {
  name: string;
  active: boolean
}

export default function Start(
  io: Server,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * When the host start the game
   */
  socket.on("START", async function (data) {
    if (!data.id) return;

    const room = Rooms.get(data.id);

    if (!room) return;

    console.log(`${room.id} -> STARTING !`);

    resetAnswer(room, false);
    resetScore(room);
    

    room.started = true;

    room.showCategories = data.showCategories

    const categories: string[] = data.categories.filter((e: any) => e.active === true).map((e: Category) => {
      return e.name.toLowerCase().replace(/'/g, "''")
    })
    
    room.answers = await getImages(categories, room.maxRounds)

    update(io, room);

    startNextRound(io, room);

    if (room.type=="private") return;

    const formattedRooms = getPublicRooms(Rooms)

    io.emit("PUBLIC ROOMS", formattedRooms)
  });
}
