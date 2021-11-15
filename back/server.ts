import { Socket } from "socket.io";

const express = require("express");
const helmet = require("helmet");

const app = express();

app.use(helmet());

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log("Server app listening on port " + PORT);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

type Answer = {
  image: string;
  name: string;
  aliases: string[];
};

type Message = {
  author: string;
  content: string;
  date: Date;
};

type User = {
  username: string;
  score: number;
  host: boolean;
  answered: boolean;
  color: string;
};

type Room = {
  id: number;
  users: User[];
  category: "Anime";
  currentRound: number;
  maxRounds: number;
  maxTime: number;
  chat: Message[];
  // pixelisationStatus: number,
  answers: Answer[];
  started: boolean;
  // alreadyUsedImages: Answer[],
};

const Rooms: Map<number, Room> = new Map();

io.on("connection", function (socket: Socket) {
  /**
   * Send room information to every room's user
   */
  function update(id: number) {
    const room = Rooms.get(id);

    if (!room) return;

    const currentRoundImageIndex = room.currentRound - 1;

    io.sockets.in(id).emit("UPDATED", {
      id: room.id,
      users: room.users,
      category: room.category,
      currentRound: room.currentRound,
      maxRounds: room.maxRounds,
      maxTime: room.maxTime,
      chat: room.chat,
      started: room.started,
      image: room.answers[currentRoundImageIndex]?.image,
    });
  }

  /**
   * Return an User index from a room
   */
  function getUserIndex(id: number, username: string) {
    const room = Rooms.get(id);

    if (!room) return -1;

    return room.users.findIndex((e: User) => e.username == username);
  }

  /**
   * Reset all User answered in a room
   */
  function resetAnswer(id: number) {
    const room = Rooms.get(id);

    if (!room) return;

    for (let i = 0; i < room.users.length; i++) {
      room.users[i].answered = false;
    }
  }

  /**
   * Start the timer and round in a room
   */
  function startNextRound(id: number) {
    let i = 0;

    const room = Rooms.get(id);

    if (!room) return;

    let interval = setInterval(() => {
      i += 0.1;

      io.sockets.in(id).emit("UPDATE TIMER", i);

      if (i >= room.maxTime) {
        console.log("ROUND SUIVANT !");
        room.currentRound++;
        clearInterval(interval);
        resetAnswer(id);
        update(id);
        if (room.maxRounds == room.currentRound) {
          return console.log("FIN DE LA PARTIE");
        } else {
          startNextRound(id);
        }
      }
    }, 100);
  }

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
          color : ""
        }
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

  /**
   * When someone join a room
   */
  socket.on("JOIN", function (data) {
    if (!data.id || !data.name) return;

    console.log("JOINING");

    const room = Rooms.get(data.id);

    // If room doesn't exist
    if (!room) {
      return socket.emit("ERROR", {
        error: "Game doesn't exist !",
      });
    }

    // If username already in the room
    if (room.users.some((user: User) => user.username == data.name)) {
      return socket.emit("ERROR", {
        error: "Username already taken !",
      });
    }

    // If room is full
    if (room.users.length >= 20) {
      return socket.emit("ERROR", {
        error: "Game is full !",
      });
    }

    // Add the user in the room
    room.users.push({
      username: data.name,
      score: 0,
      answered: false,
      host: false,
      color: ""
    });

    socket.join(data.id);
    socket.emit("JOINED");
  });

  /**
   * When someone update data for everyone
   */
  socket.on("UPDATE", function (data) {
    if (!data.id) return;

    console.log("UPDATING");

    // If room doesn't exist
    if (!Rooms.has(data.id)) return;

    update(data.id);
  });

  /**
   * Change the category
   */
  socket.on("UPDATE CATEGORY", function (data) {
    if (!data.category || !data.id) return;

    const room = Rooms.get(data.id);

    if (!room) return;

    console.log("UPDATE CATEGORY");

    room.category = data.category;

    update(data.id);
  });

  /**
   * Change the max rounds
   */
  socket.on("UPDATE MAX ROUNDS", function (data) {
    if (!data.maxRounds || !data.id) return;

    console.log("UPDATE MAX ROUNDS");

    const room = Rooms.get(data.id);

    if (!room) return;

    room.maxRounds = data.maxRounds;

    update(data.id);
  });

  /**
   * Change the color
   */

  socket.on("CHANGE COLOR", function (data){
    const room = Rooms.get(data.id);

    if (!room) return

    const index = getUserIndex(data.id, data.name)

    room.users[index].color = data.color
  });

  /**
   * When a user leave a room
   */
  socket.on("LEAVE", function (data) {
    if (!data.name || !data.id) return;

    const room = Rooms.get(data.id);

    // If room doesn't exist
    if (!room) return;

    console.log("LEAVING");

    // Get the index of the user who is quitting
    const index = getUserIndex(data.id, data.name);

    // If user not found in the room
    if (index === -1) return;

    // Remove the user from the room
    const user = room.users.splice(index, 1)[0];

    // If the leaving user is host, pass the host to the next player
    if (user.host == true) {
      // Is there's no one in the room, close the game
      if (room.users.length == 0) {
        Rooms.delete(data.id);
        return;
      }
      room.users[0].host = true;
    }

    update(data.id);
  });

  /**
   * When the host start the game
   */
  socket.on("START", function (data) {
    if (!data.id) return;

    const room = Rooms.get(data.id);

    if (!room) return;

    console.log("STARTING");

    resetAnswer(data.id);

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

    update(data.id);

    startNextRound(data.id);
  });

  /**
   * When someone send a message in the chat
   */
  socket.on("MESSAGE", function (data) {
    const room = Rooms.get(data.id);

    if (!room) return;

    const message = {
      author: data.username,
      content: data.message,
      date: new Date(),
    };

    room.chat.push(message);

    io.sockets.in(data.id).emit("CHAT", room.chat);
  });

  /**
   * When someone submit an answer
   */
  socket.on("ANSWER", function (data) {
    const room = Rooms.get(data.id);

    if (!room) return;

    const currentRoundImageIndex = room.currentRound - 1;
    if (
      data.answer.toLowerCase() == room.answers[currentRoundImageIndex].name ||
      room.answers[currentRoundImageIndex].aliases.includes(
        data.answer.toLowerCase()
      )
    ) {
      const index = getUserIndex(data.id, data.name);

      if (index === undefined) return;

      room.users[index].answered = true;

      room.users[index].score++;

      socket.emit("GOOD ANSWER");

      update(data.id);
    } else {
      socket.emit("WRONG ANSWER");
    }
  });
});
