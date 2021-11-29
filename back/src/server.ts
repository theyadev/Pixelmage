import express from "express";
import helmet from "helmet";

import { Socket, Server } from "socket.io";

import { Room } from "./types";


import Answer from "./events/answer";
import ChangeColor from "./events/change_color";
import Create from "./events/create";
import Join from "./events/join";
import Leave from "./events/leave";
import Message from "./events/message";
import Start from "./events/start";
import UpdateCategory from "./events/update_category";
import UpdateMaxRounds from "./events/update_max_rounds";
import Update from "./events/update";
import getCategories from "./events/get_categories";
import GetPublicRooms from "./events/get_public_rooms";

const app = express();

app.use(helmet());

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log("Server app listening on port " + PORT);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const Rooms: Map<number, Room> = new Map();

io.on("connection", function (socket: Socket) {
  Answer(io, socket, Rooms);

  ChangeColor(socket, Rooms);

  Create(socket, Rooms, io);

  Join(socket, Rooms);

  Leave(io, socket, Rooms);

  Message(io, socket, Rooms);

  Start(io, socket, Rooms);

  UpdateCategory(io, socket, Rooms);

  UpdateMaxRounds(io, socket, Rooms);

  Update(io, socket, Rooms);

  getCategories(socket)

  GetPublicRooms(socket, Rooms)
});
