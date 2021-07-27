//modules
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use("/", express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{
    console.log('New WS connection');

    socket.emit('message', 'Welcome!');

    socket.on('chatMessage', msg =>{
        io.emit('message', msg);
        console.log("message emitted");
    })
})

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server running on port ' + PORT));