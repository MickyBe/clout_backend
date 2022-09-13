import { notificationMessage } from '../config/message';

const {
  notificationChannel,
  announcementChannel,
  locationChannel,
  groupLocationChannel
} = require('../utilities/helper/channel-formatter');
const publisher = require('redis').createClient('redis://localhost:6379');
publisher.connect();

export const requestSent = (id, senderName) => {
  publisher.publish(
    notificationChannel(id),
    `${senderName} ${notificationMessage.requestSent}`
  );
};

export const requestRejected = (id, rejectorName) => {
  publisher.publish(
    notificationChannel(id),
    `${rejectorName} ${notificationMessage.requestRejected}`
  );
};

export const requestAccepted = (id, acceptorName) => {
  publisher.publish(
    notificationChannel(id),
    `${acceptorName} ${notificationMessage.requestAccepted}`
  );
};

export const groupRequest = (ids, groupName, ownerName) => {
  const channels = ids.map((id) => notificationChannel(id));
  channels.forEach((channel) => {
    publisher.publish(
      channel,
      `You have been invited to ${groupName} by ${ownerName}`
    );
  });
};

export const sendAnnouncement = (ids, toSend) => {
  const channels = ids.map((id) => announcementChannel(id));
  channels.forEach((channel) => {
    publisher.publish(channel, JSON.stringify(toSend));
  });
};
export const requestAcceptedLocation = (friendId,uId,fId,sId,createGroup,type,friendVisibility) => {
  const myJSON = JSON.stringify({
    userId:uId,
    friendId:friendId,
    fId:fId,
    sId:sId,
    createGroup:createGroup,
    type:type,
    friendVisibility:friendVisibility
  });
  console.log("sdlfjnsa",myJSON);
  publisher.publish(
    locationChannel(uId),`${myJSON}`
  );
};
export const groupRequestLocation = (groupId,ownerId,uId,allowGroup,type) => {
  const myJSON = JSON.stringify({
    userId:uId,
    groupId:groupId,
    ownerId:ownerId,
    allowGroup:allowGroup,
    type:type
  });
  console.log("sdlfjnsa",myJSON);
  publisher.publish(
    groupLocationChannel(uId),`${myJSON}`
  );
};
