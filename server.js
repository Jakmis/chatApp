const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Složka se statickými soubory
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'chatBot';

io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room);

        //Uvítací zpráva
        socket.emit('message', formatMessage(botName, 'Vítej v chatApp!'));

        //Zdělení ostatním uživatelům o připojení nového uživatele
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} se připojil do chatu`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
     //Zdělení ostatním uživatelům o odpojení uživatele
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} se odpojil`)
        );

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });

    
    //Získat zprávu
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
});

//Port na kterém nasloucha server je 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, function(){
    console.log(`Server nasloucha na portu ${PORT}`);
})
