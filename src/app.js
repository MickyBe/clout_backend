import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import routes from './routes/';

import {getFriends,getProfile, getGroups, signOutVisibility} from './service/location.js';
import { async } from 'regenerator-runtime';
const redis = require('redis');

export const redisServer = redis.createClient({url:'redis://localhost:6379'});//{url:'redis://localhost:6379'}

const serviceAccount = require("./config/kliq-firebase-serviceAccountKey.json");
export const sequelize = require('./models').sequelize;

const app = express();
// const cookieParser = require("cookie-parser");
// const csrf = require("csurf");
// const admin = require("firebase-admin");
export const server = http.createServer(app);
// const csrfMiddleware = csrf({ cookie: true });
const io = require('socket.io')(server);

export const socket = async() => {
  redisServer.on('error', (err) => console.log('Redis Client Error', err));
  await redisServer.connect();
  redisServer.on('connect', function(){
    console.log('Connected to Redis...=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  });
  // redisServer.connect();
  // redisServer.on('connect', () => {
  //   console.log('Redis connected ....');
  //   // socket.emit(channel, { message: message });
  // });

  // redisServer.on('error', (err) => console.log('Redis Client Error', err));

  //socket io store online clients
  var clients = {};
  var clientsId = {};

  // Run when client connects
  io.on('connection', (socket) => {
    const subscriber = redisServer.duplicate();
    subscriber.connect();
    console.log('socket connected');

    // redisServer.pSubscribe('notification-*', (message, channel) => {
    //   socket.emit(channel, { message: 'sdofoidf' });
    // });

    socket.on('sendlocation', (data) => {
      console.log('>>>>>>> USER LOCATION >>>>>>');
      console.log(data);
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    });

    io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });
    io.of("/").adapter.on("delete-room", (room) => {
      console.log(`room ${room} was deleted`);
    });
    io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });
    io.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`socket ${id} has leave room ${room}`);
    });

    socket.on('signin', async(data) => {
      console.log(' >>>>>>>>>>>>> sign in is emitted >>>>>>>>');
      console.log(data);
      
      //redise setup
      const chanelName = `location${data.id}`;
      let oldValue = await redisServer.get(chanelName);
      if(oldValue == null){
        oldValue = {
          'id': chanelName,
          'disconnected':false
        }
      }else{
        oldValue = JSON.parse(oldValue);
        oldValue.disconnected = false;
      }
      //set image
      await getProfile(data.id, async(username,profileImage) => {
        console.log("sadfsadfsadfsadfsadfasd===========",username,profileImage)
        oldValue.name = username;
        oldValue.image = profileImage;
      });

      await redisServer.set(chanelName, JSON.stringify({
        ...oldValue}), function(err, reply){
        if(err){
          console.log("error",err);
        }
        console.log("ok!!",reply);
      });
      //save socket instance of the user
      clients[data.id] = socket;
      clientsId[socket.id] ={id:data.id,groups:[]};
      // sockets[receiverSocketId].join(room);

      //join room or create user room
      socket.join(`location${data.id}`);

      getFriends(data.id, async(person,friends) => {
        //join friends room for loop
        console.log("iterating over the fore loop");
        for(let i=0; i<friends.length; i++){
          const friendSocket = clients[friends[i].uid];
          const userLocation = await redisServer.get(`location${person.uid}`);
          const friendLocation = await redisServer.get(`location${friends[i].uid}`);
          if(friendSocket){
            // join friends room 
            socket.join(`location${friends[i].uid}`);
            //add friends to your room
            friendSocket.join(`location${person.uid}`);
            io.to(friendSocket.id).emit("location", JSON.parse(userLocation));
            io.to(socket.id).emit("location", JSON.parse(friendLocation));
            console.log("this is the friend",friends[i].uid);
          }else{
            io.to(socket.id).emit("location", JSON.parse(friendLocation));
            console.log("friend is not online +++++++++++++++>>>>>>========");
          }
        }
        console.log("this are the clients connected",'test','test2');
      });


      getGroups(data.id, async(owner,groups,groupsUnblocked) => {
        
        console.log("every thing went according to plan");
        //join friends room for loop
        // console.log("iterating over the fore loop");

        // for(let i=0; i<groups.length; i++){
        //   socket.join(`group-location-g${groups[i].id}-o${owner}`);
        //   console.log("this is the the group/*/*------------/*/*",`group-location-g${groups[i].id}-o${owner}`);
        // }
        
        //add to list of groups aligable for location brodcast
        for(let i=0; i<groupsUnblocked.length; i++){
          const groupSocket = `group-location-g${groupsUnblocked[i].id}-o${owner}`;
          socket.join(groupSocket.toString());
          clientsId[socket.id].groups.indexOf(groupSocket.toString()) === -1 ? clientsId[socket.id].groups.push(groupSocket.toString()) : console.log("This group already exists");
          console.log("group being white listed +++++++++++++++>>>>>>========",groupSocket);
        }
        console.log("every thing went according to plan");
      });
      // redisServer.HSET(`${data.id}`,{
      //   "name":"test"
      // });
      // redisServer.HGET("name", async (error,data) => {
      //   if(error) console.error(error);
      //   if(data!=null){
      //     console.log("this is the data");
      //   }
      // }),
      subscriber.subscribe(`notification-${data.id}`, (message, channel) => {
        console.log(`SUBSCRIBED TO CHANNEL ${channel}`);
        socket.emit(channel, { message });
      });

      subscriber.subscribe(`location-s`,async(message, channel) => {
        const obj = JSON.parse(message);
        console.log(`============>making conection<========== ${channel} and message ${message}`);
        const friendSocket = clients[obj.friendId];
        const userSocket = clients[obj.userId];
        const createGroup = obj.createGroup;
        const friendVisibility=obj.friendVisibility;
        const type = obj.type;
        const userLocation = await redisServer.get(`location${obj.userId}`);
        const friendLocation = await redisServer.get(`location${obj.friendId}`);
        if(type){
          if(createGroup){
            if(friendVisibility){
              console.log("values========",userLocation,JSON.parse(userLocation));
              userSocket.join(`location${obj.friendId}`);
              friendSocket.join(`location${obj.userId}`);
              io.to(friendSocket.id).emit("location", JSON.parse(userLocation));
              io.to(userSocket.id).emit("location", JSON.parse(friendLocation));
              console.log("add to group",createGroup);
              io.to(friendSocket.id).emit("friend-visibility", { fuId:obj.userId, fid:obj.sId, online : createGroup });
            }
          }else{
            console.log("remove from group",createGroup,obj);
            friendSocket.leave(`location${obj.userId}`);
            userSocket.leave(`location${obj.friendId}`);
            io.to(friendSocket.id).emit("location", { id:obj.userId,type:0, online : createGroup });
            io.to(userSocket.id).emit("location", { id:obj.friendId,type:0, online : createGroup });
            io.to(friendSocket.id).emit("friend-visibility", { fuId:obj.userId, fid:obj.sId, online : createGroup });
          }
          return true;
        }
        else{
          if(friendSocket){
            // join friends room 
            if(userSocket){
              userSocket.join(`location${obj.friendId}`);
            }else{
              console.log("person is not online +++++++++++++++>>>>>>========");
            }
            //add friends to your room
            friendSocket.join(`location${obj.userId}`);
            io.to(friendSocket.id).emit("location", JSON.parse(userLocation));
            io.to(userSocket.id).emit("location", JSON.parse(friendLocation));
            console.log("person",obj.userId);
          }else{
            console.log("friend is not online +++++++++++++++>>>>>>========");
          }
      }
      });
      subscriber.subscribe(`group-location-s`, async (message, channel) => {
        const obj = JSON.parse(message);
        console.log(`============>making conection groups<========== ${channel} and message ${message}`);
        const userSocket = clients[obj.userId];
        const allowGroup = obj.allowGroup;
        const type = obj.type;
        const groupSocket=`group-location-g${obj.groupId}-o${obj.ownerId}`;
        const userLocation = await redisServer.get(`location${obj.userId}`);
        if(type){
          // false or true
          console.log("this is the the group/*/*------togle------/*/*",groupSocket);
          if(allowGroup){
            userSocket.join(groupSocket.toString());
            clientsId[userSocket.id].groups.indexOf(groupSocket.toString()) === -1 ? clientsId[userSocket.id].groups.push(groupSocket.toString()) : console.log("This group already exists");
            socket.to(groupSocket.toString()).emit('location', JSON.parse(userLocation));
            console.log("add to group",allowGroup);
          }else{
            clientsId[userSocket.id].groups=clientsId[userSocket.id].groups.filter(item => item !== groupSocket.toString());
            userSocket.leave(groupSocket.toString());
            userSocket.to(groupSocket.toString()).emit("location", { id:obj.userId, type:1, groupOnline : allowGroup, group:groupSocket.toString() });
            userSocket.emit("location",{ clearGroup:true, group:groupSocket.toString() })
            console.log("remove from group",allowGroup,obj);
          }
        }else{
          userSocket.join(groupSocket.toString());
          socket.to(groupSocket.toString()).emit('location', JSON.parse(userLocation));
          console.log("this is the the group initial creation or joining =========-->>>>>>>>>>",groupSocket);
          //add to list of groups aligable for location brodcast
          clientsId[userSocket.id].groups.indexOf(groupSocket.toString()) === -1 ? clientsId[userSocket.id].groups.push(groupSocket.toString()) : console.log("This group already exists");
        }
        return true;
      });

      subscriber.subscribe(`announcement-${data.id}`, (message, channel) => {
        console.log("Announcement channel is created with the created pars");
        socket.emit(channel, { message });
      });
    });

    socket.on('location', async (msg) => {
      const chanelName = `location${msg.id}`;
      const clientRoom ="location"+msg.id;
      msg.online = true;//socket.broadcast.
      msg.type = 0;
      msg.group="";
      // console.log("data",msg);
      const tr = io.sockets.adapter.rooms;
      let value = await redisServer.get(chanelName);
      if(value){
        value = JSON.parse(value);
        msg.name = value.name;
        msg.image = value.image;
      }
      await redisServer.set(chanelName, JSON.stringify({
        ...msg}), function(err, reply){
        if(err){
          console.log("error",err);
        }
        console.log("ok!!",reply);
      });
      console.log("values========",value);
      console.log("rooms",tr);
      socket.to(clientRoom.toString()).emit('location', msg);
      //emite to groups
      for(let i=0; i<clientsId[socket.id]?.groups.length; i++){
        msg.type = 1;
        msg.groupOnline=true;
        msg.online = false;
        msg.group=clientsId[socket.id].groups[i].toString();
        socket.to(clientsId[socket.id].groups[i].toString()).emit('location', msg);
        console.log("Sending lication to group/*/*------------/*/*",clientsId[socket.id].groups[i]);
      }
    });


    socket.on('logout', (data) => {
      console.log('logout activated');
      console.log(data);
      console.log(`notification-${data.id}`);
      subscriber.unsubscribe(`notification-${data.id}`);
      // subscriber.unsubscribe(`notification-${data.id}`, (message, channel) => {
      //   console.log('CHANNEL UNSUBSCRIBED');
      //   console.log('Message ', message);
      //   console.log('Channel ', channel);
      // });
    });

    subscriber.on('error', (err) => console.log('ERR >> ', err));

    // Runs when client disconnects
    socket.on('disconnect', async(data) => {
      console.log("data",data);
      console.log("clientsId[socket.id]",clientsId[socket.id])
      if(clientsId[socket.id]){
      let Id = clientsId[socket.id].id;
      const chanelName = `location${Id}`;
      let value = await redisServer.get(chanelName);
      if(value){
        console.log("value",value);
        value = JSON.parse(value);
        value.disconnected = true;
        await redisServer.set(chanelName, JSON.stringify({
        ...value}), function(err, reply){
        if(err){
          console.log("error",err);
        }
        console.log("ok!!",reply);
      });
      console.log("value after",value);
      }
      signOutVisibility(Id)
      delete clients[Id];
      delete clientsId[socket.id];
      const clientRoom = `location${Id}`;
      socket.to(clientRoom.toString()).emit('location', value);
      // io.emit('location', msg);
    }
    });
  });

  io.on('connect_error', function (err) {
    console.log('>>>>>>>>>>>>>>>');
    console.log(err.message);
    console.log('>>>>>>>>>>>>>');
  });
};
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // databaseURL: "https://server-auth-41acc.firebaseio.com",
// });
// app.use(cookieParser());
// app.use(csrfMiddleware);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public/uploads')));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
  next();
});
// app.all("*", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });
// app.put("/sessionLogin", (req, res) => {
//   const idToken = req.body.idToken.toString();

//   const expiresIn = 60 * 60 * 24 * 5 * 1000;
//   for(let i=0;i<50;i++){
//     console.log ("this",idToken); 
//   }
//   admin
//     .auth()
//     .createSessionCookie(idToken, { expiresIn })
//     .then(
//       (sessionCookie) => {
//         const options = { maxAge: expiresIn, httpOnly: true };
//         res.cookie("session", sessionCookie, options);
//         res.end(JSON.stringify({ status: "success" }));
//       },
//       (error) => {
//         res.status(401).send("UNAUTHORIZED REQUEST!");
//       }
//     );
// });
routes(app);
