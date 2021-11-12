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

  function update(id) {
    io.sockets.in(id).emit('UPDATED', Games.get(id));
  }

  
  socket.on("CREATE", function (data) {
    if (!data.id || !data.name) return;
    console.log("CREATING");
    Games.set(data.id, {
      users: [{
        username: data.name,
        score: 0,
        answerStatus: false,
        host: true,
      }],
      chat: [],
      pixelisationStatus: 0,
      currentImage: 0,
      answer: "",
      gameStart: true,
      currentRound: 1,
      category: "Anime",
      maxRounds: 5,
      alreadyUsedImages: [],
    });
    
    socket.join(data.id);
    io.sockets.in(data.id).emit('CREATED', socket.id);
  });
  
  socket.on("JOIN", function (data) {
    console.log(data);
    if (!data.id || !data.name) return;
    
    console.log("JOINING");
    
    if (!Games.has(data.id)) return

    // TODO: Si il y a deja le meme pseudo dans la salle return Message "Pseudo deja pris"
    // TODO: Si il y a plus de 20 joueurs return Message: "Salle pleine"

    if (Games.get(data.id).users.some(user => user.username == data.name)) {
      return socket.emit("ERROR", {
        error: "Il y a deja cet utilisateur dans la salle !"
      })
    }

    if (Games.get(data.id).users.length >= 20) {
      return socket.emit("ERROR", {
        error: "Game is full !"
      })
    }
    
    Games.get(data.id).users.push({
      username: data.name,
      score: 0,
      answerStatus: false,
      host: false,
    })
    
    socket.join(data.id);
    socket.emit('JOINED')
  });
  
  socket.on("UPDATE", function (data) {
    if (!data.id) return;
    
    console.log("UPDATING");
    
    if (!Games.has(data.id)) return
    
    update(data.id)
  });
  
  socket.on("UPDATECATEGORY", function (data) {
    if (!data.category || !data.id) return;
    
    console.log("UPDATE CATEGORY");
    
    Games.get(data.id).category = data.category;
    update(data.id)
  })
  
  socket.on("UPDATEMAXROUNDS", function (data) {
    if (!data.maxRounds || !data.id) return;
    
    console.log("UPDATE MAX ROUNDS");
    Games.get(data.id).maxRounds = data.maxRounds;
    update(data.id)
  })
  
  socket.on("LEAVE", function(data) {
    if (!data.name || !data.id) return

    if (!Games.has(data.id)) return

    // TODO: Si c'est le host qui quitte, alors : 1* Changer le host au joueur suivant | 2* Faire quitter tout le monde.
    
    console.log("LEAVING");
    
    const index = Games.get(data.id).users.findIndex(e => e.name == data.name)

    Games.get(data.id).users.splice(index, 1)

    update(data.id)
  })
  
});
