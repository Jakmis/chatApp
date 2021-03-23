const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('user');
//Získat jméno a room z URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Připojit se do místnosti
socket.emit('joinRoom', {username, room});

//Získat místnost a uživatele
socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//Zpráva ze serveru
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Posun zpráv
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//Odeslat zprávu
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Získat text zprávy
    const msg = e.target.elements.msg.value;

    //Zpráva na server
    socket.emit('chatMessage', msg);

    //Vyčistit input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
};

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join()}
    `;
}
