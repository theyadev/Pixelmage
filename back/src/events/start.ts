import { Socket } from "socket.io";
import { Room } from "../types/types";

import update from "../functions/update";
import resetAnswer from "../functions/resetAnswer";
import startNextRound from "../functions/startNextRound";

export default function Start(
  io: any,
  socket: Socket,
  Rooms: Map<number, Room>
) {
  /**
   * When the host start the game
   */
  socket.on("START", function (data) {
    if (!data.id) return;

    const room = Rooms.get(data.id);

    if (!room) return;

    console.log("STARTING");

    resetAnswer(room);

    room.started = true;

    for (let i = 0; i < room.maxRounds; i++) {
      // TODO: Mettre des images aléatoires, sans duplicate
      room.answers.push({
        image:
          "https://pokemonletsgo.pokemon.com/assets/img/common/char-pikachu.png",
        name: "pikachu",
        aliases: ["pikapika"],
      });
    }

    update(io, room);

    startNextRound(io, room);
  });
}
