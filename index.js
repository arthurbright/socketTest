//modules
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dictionary = require('./utils/dictionary.js');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use("/", express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) =>{
        socket.join(room);
        
        //welcome current user
        socket.emit('message', {content: "Welcome!", username: "System"});

        //broadcast to other users
        socket.broadcast.to(room).emit('message', {content: username + " has joined.", username: "System"});

        
    });
    

    socket.on('chatMessage', async (msg) =>{
        dictionary.isWord(msg.content, (b) =>{
            if(b){
                io.to(msg.room).emit('message', msg);
            }
            console.log(b);
        })
        
        
        
        
    });

    
});


app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server running on port ' + PORT));