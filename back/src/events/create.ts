import { Socket } from "socket.io";
import { Room } from "../types/types";

export default function Create(socket: Socket, Rooms: Map<number, Room>) {
  /**
   * When someone create a room
   */
  socket.on("CREATE", function (data) {
    if (!data.id || !data.name) return;

    console.log("CREATING");

    // Initialize the room and add the creator to it
    Rooms.set(data.id, {
      id: data.id,
      users: [
        {
          username: data.name,
          score: 0,
          host: true,
          answered: false,
          color: "",
        },
      ],
      category: "Anime",
      currentRound: 1,
      maxRounds: 5,
      maxTime: 10,
      chat: [],
      // pixelisationStatus: 0,
      answers: [],
      started: false,
      // alreadyUsedImages: [],
    });

    socket.join(data.id);
    socket.emit("CREATED", socket.id);
  });
}
