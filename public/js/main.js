const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const input = document.getElementById('msg');

const socket = io();

socket.on('message', (message) =>{
    outputMessage(message);
})


chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    let msg = input.value;
    console.log(msg);
    if(!msg){
        return false;
    }
    
    socket.emit('chatMessage', msg);
    input.value = " ";
    //e.target.elements.msg.focus();
   
})


function outputMessage(message){
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.innerText = message;
    div.appendChild(p);

    chatBox.appendChild(div);
}