const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
 
//Získat jméno a room z URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Připojit se do místnosti
socket.emit('joinRoom', {username, room});

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