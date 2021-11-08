const express = require("express");
const helmet = require("helmet");

const app = express();

const port = process.env.PORT || 8000;

app.use(helmet());

const server = app.listen(port, () => {
  console.log("Server app listening on port " + port);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const Games = new Map();

io.on("connection", function (socket) {
  socket.on("CREATE", function (data) {
    if (!data.id || !data.name) return;
    console.log("Hello");
    Games.set(data.id, {
      users: [{
        username: data.name,
        score: 0,
        answerStatus: false,
        room: data.id,
        host: true,
      }],
      chat: [],
      pixelisationStatus: 0,
      currentImage: 0,
      answer: "",
      gameStart: true,
      currentRound: 1,
      category: "",
      alreadyUsedImages: [],
    });

    socket.join(data.id);
    io.sockets.in(data.id).emit('CREATED', socket.id);
  });
});
