const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const input = document.getElementById('msg');
const gameStatus = document.getElementById('gameStatus');
const gameForm = document.getElementById('gameForm');
const gameFormText = document.getElementById('gameFormText');
const prevWord = document.getElementById('prevWord');
const startButton = document.getElementById('startButton');

const socket = io();

//redirect
if(sessionStorage.getItem("room") == null){
    window.location.href = "/";
}
else{
    socket.emit('joinRoom', {room: sessionStorage.getItem("room"), username: sessionStorage.getItem("username")});
}



socket.on('message', (message) =>{
    outputMessage(message);
})


chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    let msg = {
        content: input.value,
        username: sessionStorage.getItem("username"),
        room: sessionStorage.getItem("room")
    };
    //if empty
    if(!input.value){
        return false;
    }
    
    socket.emit('chatMessage', msg);
    input.value = "";
    e.target.elements.msg.focus();
   
})


function outputMessage(message){
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.innerText = message.username + ": " + message.content;
    div.appendChild(p);

    chatBox.appendChild(div);
}


//gameplay

startButton.addEventListener('click', (e)=>{
    socket.emit("startGame", socket.id);
});

gameForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    socket.emit("gameMessage", gameFormText.value);
    gameFormText.value = "";
    gameFormText.focus();

    
});




//socket recieving
socket.on("disableStart", ()=>{
    disableStart();
})

socket.on("updateTurn", (res) =>{ 
    //res.prevWord, res.prevUsername, res.currentUsername
    prevWord.innerHTML = res.prevUsername + "'s previous word: " + res.prevWord;
    gameStatus.innerHTML = res.currentUsername + "'s turn:";
});


//functions
function disableStart(){
    startButton.disabled = true;
}
function enableStart(){
    startButton.disabled = false;
}

