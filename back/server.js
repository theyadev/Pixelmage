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
    io.sockets.in(id).emit("UPDATED", Rooms.get(id));
  }

  socket.on("CREATE", function (data) {
    if (!data.id || !data.name) return;

    console.log("CREATING");

    // Initialize the room and add the creator to it
    Rooms.set(data.id, {
      users: [
        {
          username: data.name,
          score: 0,
          host: true,
          // answerStatus: false,
        },
      ],
      category: "Anime",
      maxRounds: 5,
      // chat: [],
      // pixelisationStatus: 0,
      // currentImage: 0,
      // answer: "",
      // gameStart: true,
      // currentRound: 1,
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

    // TODO: Si c'est le host qui quitte, alors : 1* Changer le host au joueur suivant | 2* Faire quitter tout le monde.

    console.log("LEAVING");

    // Get the index of the user who is quitting
    const index = Rooms.get(data.id).users.findIndex(
      (e) => e.name == data.name
    );

    // Remove the user from the room
    Rooms.get(data.id).users.splice(index, 1);

    update(data.id);
  });
});
