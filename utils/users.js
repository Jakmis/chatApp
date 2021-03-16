const { relativeTimeRounding } = require("moment");

const users = [];

//Připojit uživatele do chatu
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//Uživatel se odpojil
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Místnost uživatele
function getRoomUsers(room) {
    return user.filter(user => user.room === room);

}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};