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

const Rooms = new Map();

io.on("connection", function (socket) {
  /**
   * A function to send room information to every room's user
   * @param {string} id
   */
  function update(id) {
    const room = Rooms.get(id)

    io.sockets.in(id).emit("UPDATED", {
      id: room.id,
      users: room.users,
      category: room.category,
      currentRound: room.currentRound,
      maxRounds: room.maxRounds,
      chat: room.chat,
      started: room.started,
    });
  }

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
          // answered: false,
        },
      ],
      category: "Anime",
      currentRound: 1,
      maxRounds: 5,
      chat: [],
      images: [],
      // pixelisationStatus: 0,
      // answer: "",
      started: false,
      // alreadyUsedImages: [],
    });

    socket.join(data.id);
    socket.emit("CREATED", socket.id);
  });

  socket.on("JOIN", function (data) {
    if (!data.id || !data.name) return;

    console.log("JOINING");

    // If room doesn't exist
    if (!Rooms.has(data.id)) {
      return socket.emit("ERROR", {
        error: "Game doesn't exist !",
      });
    }

    // If username already in the room
    if (Rooms.get(data.id).users.some((user) => user.username == data.name)) {
      return socket.emit("ERROR", {
        error: "Username already taken !",
      });
    }

    // If room is full
    if (Rooms.get(data.id).users.length >= 20) {
      return socket.emit("ERROR", {
        error: "Game is full !",
      });
    }

    // Add the user in the room
    Rooms.get(data.id).users.push({
      username: data.name,
      score: 0,
      answerStatus: false,
      host: false,
    });

    socket.join(data.id);
    socket.emit("JOINED");
  });

  socket.on("UPDATE", function (data) {
    if (!data.id) return;

    console.log("UPDATING");

    // If room doesn't exist
    if (!Rooms.has(data.id)) return;

    update(data.id);
  });

  socket.on("UPDATECATEGORY", function (data) {
    if (!data.category || !data.id) return;

    console.log("UPDATE CATEGORY");

    Rooms.get(data.id).category = data.category;

    update(data.id);
  });

  socket.on("UPDATEMAXROUNDS", function (data) {
    if (!data.maxRounds || !data.id) return;

    console.log("UPDATE MAX ROUNDS");

    Rooms.get(data.id).maxRounds = data.maxRounds;
    
    update(data.id);
  });

  socket.on("LEAVE", function (data) {
    if (!data.name || !data.id) return;

    // If room doesn't exist
    if (!Rooms.has(data.id)) return;

    console.log("LEAVING");

    // Get the index of the user who is quitting
    const index = Rooms.get(data.id).users.findIndex(
      (e) => e.username == data.name
    );

    // Remove the user from the room
    const user = Rooms.get(data.id).users.splice(index, 1)[0];

    // If the leaving user is host, pass the host to the next player
    if (user.host == true) {
      // Is there's no one in the room, close the game
      if (Rooms.get(data.id).users.length == 0) {
        Rooms.delete(data.id)
        return
      }
      Rooms.get(data.id).users[0].host = true
    }

    console.log(Rooms.get(data.id));

    update(data.id);
  });

  socket.on("START", function (data){
    if (!data.id) return
    
    console.log("STARTING");

    Rooms.get(data.id).started = true

    Rooms.get(data.id).images = [
      "https://pokemonletsgo.pokemon.com/assets/img/common/char-pikachu.png", "https://pokemonletsgo.pokemon.com/assets/img/common/char-pikachu.png"
    ]

    update(data.id)
  })

  socket.on("MESSAGE", function (data) {
    const message = {
      author: data.username,
      content: data.message,
      date: new Date()
    }
    Rooms.get(data.id).chat.push(message)

    io.sockets.in(data.id).emit("CHAT", Rooms.get(data.id).chat)
  })

});
