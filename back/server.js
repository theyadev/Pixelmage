"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var helmet = require("helmet");
var app = express();
app.use(helmet());
var PORT = process.env.PORT || 8000;
var server = app.listen(PORT, function () {
    console.log("Server app listening on port " + PORT);
});
var io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
var Rooms = new Map();
io.on("connection", function (socket) {
    /**
     * A function to send room information to every room's user
     * @param {number} id
     */
    function update(id) {
        var _a;
        var room = Rooms.get(id);
        if (!room)
            return;
        var currentRoundImageIndex = room.currentRound - 1;
        io.sockets.in(id).emit("UPDATED", {
            id: room.id,
            users: room.users,
            category: room.category,
            currentRound: room.currentRound,
            maxRounds: room.maxRounds,
            maxTime: room.maxTime,
            chat: room.chat,
            started: room.started,
            image: (_a = room.answers[currentRoundImageIndex]) === null || _a === void 0 ? void 0 : _a.image,
        });
    }
    /**
     * @param {number} id
     * @param {string} username
     */
    function getUserIndex(id, username) {
        var room = Rooms.get(id);
        if (!room)
            return;
        return room.users.findIndex(function (e) { return e.username == username; });
    }
    socket.on("CREATE", function (data) {
        if (!data.id || !data.name)
            return;
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
    socket.on("JOIN", function (data) {
        if (!data.id || !data.name)
            return;
        console.log("JOINING");
        // If room doesn't exist
        if (!Rooms.has(data.id)) {
            return socket.emit("ERROR", {
                error: "Game doesn't exist !",
            });
        }
        // If username already in the room
        var room = Rooms.get(data.id);
        if (!room)
            return;
        if (room.users.some(function (user) { return user.username == data.name; })) {
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
        });
        socket.join(data.id);
        socket.emit("JOINED");
    });
    socket.on("UPDATE", function (data) {
        if (!data.id)
            return;
        console.log("UPDATING");
        // If room doesn't exist
        if (!Rooms.has(data.id))
            return;
        update(data.id);
    });
    socket.on("UPDATECATEGORY", function (data) {
        if (!data.category || !data.id)
            return;
        console.log("UPDATE CATEGORY");
        var room = Rooms.get(data.id);
        if (!room)
            return;
        room.category = data.category;
        update(data.id);
    });
    socket.on("UPDATEMAXROUNDS", function (data) {
        if (!data.maxRounds || !data.id)
            return;
        console.log("UPDATE MAX ROUNDS");
        var room = Rooms.get(data.id);
        if (!room)
            return;
        room.maxRounds = data.maxRounds;
        update(data.id);
    });
    socket.on("LEAVE", function (data) {
        if (!data.name || !data.id)
            return;
        // If room doesn't exist
        if (!Rooms.has(data.id))
            return;
        console.log("LEAVING");
        // Get the index of the user who is quitting
        var index = getUserIndex(data.id, data.name);
        var room = Rooms.get(data.id);
        if (!room || index === undefined)
            return;
        // Remove the user from the room
        var user = room.users.splice(index, 1)[0];
        // If the leaving user is host, pass the host to the next player
        if (user.host == true) {
            // Is there's no one in the room, close the game
            if (room.users.length == 0) {
                Rooms.delete(data.id);
                return;
            }
            room.users[0].host = true;
        }
        console.log(room);
        update(data.id);
    });
    function resetAnswer(id) {
        var room = Rooms.get(id);
        if (!room)
            return;
        for (var i = 0; i < room.users.length; i++) {
            room.users[i].answered = false;
        }
    }
    function startNextRound(id) {
        var i = 0;
        var room = Rooms.get(id);
        if (!room)
            return;
        var interval = setInterval(function () {
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
                }
                else {
                    startNextRound(id);
                }
            }
        }, 100);
    }
    socket.on("START", function (data) {
        if (!data.id)
            return;
        console.log("STARTING");
        resetAnswer(data.id);
        var room = Rooms.get(data.id);
        if (!room)
            return;
        room.started = true;
        for (var i = 0; i < room.maxRounds; i++) {
            // TODO: Mettre des images aléatoires, sans duplicate
            room.answers.push({
                image: "https://pokemonletsgo.pokemon.com/assets/img/common/char-pikachu.png",
                name: "pikachu",
                aliases: ["pikapika"],
            });
        }
        update(data.id);
        startNextRound(data.id);
    });
    socket.on("MESSAGE", function (data) {
        var message = {
            author: data.username,
            content: data.message,
            date: new Date(),
        };
        var room = Rooms.get(data.id);
        if (!room)
            return;
        room.chat.push(message);
        io.sockets.in(data.id).emit("CHAT", room.chat);
    });
    socket.on("ANSWER", function (data) {
        var room = Rooms.get(data.id);
        if (!room)
            return;
        var currentRoundImageIndex = room.currentRound - 1;
        if (data.answer.toLowerCase() == room.answers[currentRoundImageIndex].name ||
            room.answers[currentRoundImageIndex].aliases.includes(data.answer.toLowerCase())) {
            var index = getUserIndex(data.id, data.name);
            if (index === undefined)
                return;
            room.users[index].answered = true;
            room.users[index].score++;
            socket.emit("GOOD ANSWER");
            update(data.id);
        }
        else {
            socket.emit("WRONG ANSWER");
        }
    });
});
