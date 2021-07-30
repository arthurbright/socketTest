//modules
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dictionary = require('./utils/dictionary.js');
const users = require('./utils/users');
const game = require('./utils/game');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use("/", express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) =>{
        socket.join(room);
        
        //welcome current user
        socket.emit('message', {content: "Welcome! You are in room " + room, username: "System"});

        //broadcast to other users
        socket.broadcast.to(room).emit('message', {content: username + " has joined.", username: "System"});

        //add user to user list
        users.addUser(socket.id, username, room);

        //disable start button if game started
        if(game.hasGame(room)){
            socket.emit('disableStart');
        }
        
    });
    

    socket.on('chatMessage', async (msg) =>{
        io.to(msg.room).emit('message', msg);
    });

    socket.on('disconnect', () =>{
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('message', {content: user.username + " has left.", username: "System"})
        }
        users.removeUser(socket.id);
    });

    socket.on('startGame', (id)=>{
        console.log(game.games);
        let user = users.getUser(socket.id);
        if(!game.hasGame(user.room) && users.getUsersInRoom(user.room).length > 1){
            io.to(user.room).emit("disableStart");
            game.games.push(new game.Game(user.room, users.getUsersInRoom(user.room), (res) =>{
                io.to(user.room).emit('updateTurn', res);
            }, (winner) =>{
                
                io.to(user.room).emit("gameOver", winner);
                io.to(user.room).emit("enableStart");
                game.removeGame(user.room);
            }));
        }
        

    })

    socket.on('gameMessage', msg =>{
        let user = users.getUser(socket.id);
        //check if there is a game going on
        if(!game.hasGame(user.room)){
            return;
        }
        let curGame = game.getGame(user.room);
        if(curGame.getCurrentUser().id === socket.id){
            //send it to the game
            //todo check if its a word
            curGame.sendWord(msg);
        }



    })

    
});


app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server running on port ' + PORT));