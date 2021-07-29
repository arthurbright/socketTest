const users = [];
//user structure: {id, username, room};

function addUser(id, username, room){
    const user = {id, username, room};
    users.push(user);

    return user;
}

function getUsersInRoom(room){
    return users.filter(user => user.room === room);
}

function removeUser(id){
    const index = users.findIndex(user => user.id === id);
    if(index > -1){
        users.splice(index, 1);
    }
}

function getUser(id){
    return users.find(user => user.id === id);
}


module.exports.users = users;
module.exports.addUser = addUser;
module.exports.getUsersInRoom = getUsersInRoom;
module.exports.removeUser = removeUser;
module.exports.getUser = getUser;