const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const { Console } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Složka se statickými soubory
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
    //Uvítací zpráva
    socket.emit('message', 'Vítej v chatApp!');

    //Zdělení ostatním uživatelům o připojení nového uživatele
    socket.broadcast.emit('message', 'Uživatel se připojil do chatu');

    //Zdělení ostatním uživatelům o odpojení uživatele
    socket.on('disconnect', () => {
        io.emit('message', 'Uživatel se odpojil');
    });
});

//Port na kterém nasloucha server je 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, function(){
    console.log(`Server nasloucha na portu ${PORT}`);
})
