const usernameBox = document.getElementById("usernameBox");
const roomBox = document.getElementById("roomBox");
const form = document.getElementById("mainForm");



form.addEventListener('submit', (e) =>{
    e.preventDefault();
    sessionStorage.setItem("room", roomBox.value);
    sessionStorage.setItem("username", usernameBox.value);
    window.location.href = "/chat.html";
})
