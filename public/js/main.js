const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const input = document.getElementById('msg');

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