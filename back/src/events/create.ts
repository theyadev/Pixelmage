import { Server, Socket } from "socket.io";
import getPublicRooms from "../functions/getPublicRooms";
import { Room } from "../types";

export default function Create(socket: Socket, Rooms: Map<number, Room>, io: Server) {
  /**
   * When someone create a room
   */
  socket.on("CREATE", function (data) {
    if (!data.id || !data.name || !data.type) return;

    console.log(`${data.id} -> CREATING !`);

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
      type: data.type,
      categories: [],
      showCategories: true,
      currentRound: 1,
      maxRounds: 5,
      maxTime: 30,
      chat: [],
      answers: [],
      started: false,
      currentTime: 0
    });

    socket.join(data.id);
    socket.emit("CREATED", socket.id);

    if (data.type == "private") return;
    
    const formattedRooms = getPublicRooms(Rooms)

    io.emit("PUBLIC ROOMS", formattedRooms)
  });
}
