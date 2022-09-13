export const RequestProcessType = {
  ACCEPT_REQUEST: 'ACCEPT_REQUEST',
  REJECT_REQUEST: 'REJECT_REQUEST',
  SEND_REQUEST: 'SEND_REQUEST',
};

export const ChangeVisibilityType = {
  ACCEPT_VISIBLE: "ACCEPT_VISIBLE",
  REJECT_VISIBLE: "REJECT_VISIBLE",
};

export const ChangeGroupVisibilityType = {
  ACCEPT_VISIBLE: "ACCEPT_VISIBLE",
  REJECT_VISIBLE: "REJECT_VISIBLE",
};

export const GroupVisibilityTypes = {
  ONLY_FRIENDS: 'ONLY_FRIENDS',
  REQUEST_TO_JOIN: 'REQUEST_TO_JOIN',
  PUBLIC: 'PUBLIC',
};

export const GroupRequestProcessType = {
  ACCEPT_GROUP_REQUEST: 'ACCEPT_GROUP_REQUEST',
  REJECT_GROUP_REQUEST: 'REJECT_GROUP_REQUEST',
};

export const redis = {
  host: 'localhost',
  port: 6379,
};

export const socket = {
  port: 3000,
};

export const publicAnnouncementUrl = '/home/ubuntu/kliq-BE/public/uploads';
// export const publicAnnouncementUrl = 'D:/Projects/KLIQ/kliq-BE/public/uploads';

// export const apiUrl = "http://localhost:3000";
export const apiUrl = "http://localhost";


export const notificationQueue = 'notificationMQ';

export const apiKey = "e3Gc3Zt4Ku";
