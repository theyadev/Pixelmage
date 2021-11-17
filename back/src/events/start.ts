import { Socket } from "socket.io";
import { Room } from "../types";

import update from "../functions/update";
import { resetAnswer } from "../functions/resets";
import startNextRound from "../functions/startNextRound";
import { query } from "../db";

export default function Start(
  io: any,
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

    room.started = true;

    const res = await query(`
      SELECT url, answer, aliases, category 
      FROM images 
      JOIN categories 
      ON (images."categoryId" = categories.id)
      ORDER BY random()
      LIMIT ${room.maxRounds};
    `);

    room.answers = res.rows;

    update(io, room);

    startNextRound(io, room);
  });
}
