"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendAnnouncement = exports.requestSent = exports.requestRejected = exports.requestAcceptedLocation = exports.requestAccepted = exports.groupRequestLocation = exports.groupRequest = void 0;

var _message = require("../config/message");

const {
  notificationChannel,
  announcementChannel,
  locationChannel,
  groupLocationChannel
} = require('../utilities/helper/channel-formatter');

const publisher = require('redis').createClient('redis://localhost:6379');

publisher.connect();

const requestSent = (id, senderName) => {
  publisher.publish(notificationChannel(id), `${senderName} ${_message.notificationMessage.requestSent}`);
};

exports.requestSent = requestSent;

const requestRejected = (id, rejectorName) => {
  publisher.publish(notificationChannel(id), `${rejectorName} ${_message.notificationMessage.requestRejected}`);
};

exports.requestRejected = requestRejected;

const requestAccepted = (id, acceptorName) => {
  publisher.publish(notificationChannel(id), `${acceptorName} ${_message.notificationMessage.requestAccepted}`);
};

exports.requestAccepted = requestAccepted;

const groupRequest = (ids, groupName, ownerName) => {
  const channels = ids.map(id => notificationChannel(id));
  channels.forEach(channel => {
    publisher.publish(channel, `You have been invited to ${groupName} by ${ownerName}`);
  });
};

exports.groupRequest = groupRequest;

const sendAnnouncement = (ids, toSend) => {
  const channels = ids.map(id => announcementChannel(id));
  channels.forEach(channel => {
    publisher.publish(channel, JSON.stringify(toSend));
  });
};

exports.sendAnnouncement = sendAnnouncement;

const requestAcceptedLocation = (friendId, uId, fId, sId, createGroup, type, friendVisibility) => {
  const myJSON = JSON.stringify({
    userId: uId,
    friendId: friendId,
    fId: fId,
    sId: sId,
    createGroup: createGroup,
    type: type,
    friendVisibility: friendVisibility
  });
  console.log("sdlfjnsa", myJSON);
  publisher.publish(locationChannel(uId), `${myJSON}`);
};

exports.requestAcceptedLocation = requestAcceptedLocation;

const groupRequestLocation = (groupId, ownerId, uId, allowGroup, type) => {
  const myJSON = JSON.stringify({
    userId: uId,
    groupId: groupId,
    ownerId: ownerId,
    allowGroup: allowGroup,
    type: type
  });
  console.log("sdlfjnsa", myJSON);
  publisher.publish(groupLocationChannel(uId), `${myJSON}`);
};

exports.groupRequestLocation = groupRequestLocation;