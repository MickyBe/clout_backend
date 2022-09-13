const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const sequelize = require('./util/database');
const User = require('./models/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./util/users');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET','POST','PUT','DELETE');
  next();
})
io.on("connection", socket => {
  console.log("a user connected :D",socket.id, io.engine.clientsCount);
  
  socket.on('sendlocation', msg => {
    const user = userJoin(socket.id, msg);

    // // Welcome current user
    // socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // // Broadcast when a user connects
    // socket.broadcast
    //   .to(user.room)
    //   .emit(
    //     'message',
    //     formatMessage(botName, `${user.username} has joined the chat`)
    //   );

    //
    console.log("this is the location from the user",socket.id,msg.name,msg.location);
    io.emit('location',  user);
  });

  //  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log('removing user',io.engine.clientsCount);
    io.emit('location',  user);
  });
  socket.on("disconnecting", (reason) => {
    console.log('disconecting user',io.engine.clientsCount);
  });
});
app.use('/dev', require('./routes/dev'));
app.use('/users', require('./routes/users'));

(async () =>{
  try {
    await sequelize.sync(
      {force: false}
    );
    console.log("test");
    app.listen(process.env.EXTERNAL_PORT || 3001);
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server running on port socket ${PORT}`));
  } catch (error) {
    console.error(error);
  }
})()
