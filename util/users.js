const users = [];

// Join user to chat
function userJoin(socketid, data) {
  const user = { socketid, ...data };
  objIndex=  users.findIndex((obj => obj.id == user.id));
  if(users[objIndex]){
    users[objIndex].location=user.location;
  } else {
  users.push(user);
  }
  console.log("no of users",users.length);
  return users.filter(userr => userr.id !== user.id);
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
