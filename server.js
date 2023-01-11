const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use('/peerjs', peerServer);

app.set("view engine", "ejs"); //infom the sever that we are using view engine
app.use(express.static('public')); //infoming the server to use public folder for static 


app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`); //this route is the main route, it'll automatically generate a uuid for you and redirect you. 
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room }); //this comes from room.js file
});

io.on('connection', (socket) => { //socket io is good for real time communication. it's two ways
    socket.on('join-room', (roomId, userId) => {
          socket.join(roomId);

        console.log("joined room");
        socket.broadcast.to(roomId).emit("user-connected", userId);

        socket.on('disconect', () => {
          socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });

      })

    })
        
  server.listen(process.env.PORT || 3000);
