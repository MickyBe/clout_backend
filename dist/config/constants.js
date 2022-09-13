"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socket = exports.redis = exports.publicAnnouncementUrl = exports.notificationQueue = exports.apiUrl = exports.apiKey = exports.RequestProcessType = exports.GroupVisibilityTypes = exports.GroupRequestProcessType = exports.ChangeVisibilityType = exports.ChangeGroupVisibilityType = void 0;
const RequestProcessType = {
  ACCEPT_REQUEST: 'ACCEPT_REQUEST',
  REJECT_REQUEST: 'REJECT_REQUEST',
  SEND_REQUEST: 'SEND_REQUEST'
};
exports.RequestProcessType = RequestProcessType;
const ChangeVisibilityType = {
  ACCEPT_VISIBLE: "ACCEPT_VISIBLE",
  REJECT_VISIBLE: "REJECT_VISIBLE"
};
exports.ChangeVisibilityType = ChangeVisibilityType;
const ChangeGroupVisibilityType = {
  ACCEPT_VISIBLE: "ACCEPT_VISIBLE",
  REJECT_VISIBLE: "REJECT_VISIBLE"
};
exports.ChangeGroupVisibilityType = ChangeGroupVisibilityType;
const GroupVisibilityTypes = {
  ONLY_FRIENDS: 'ONLY_FRIENDS',
  REQUEST_TO_JOIN: 'REQUEST_TO_JOIN',
  PUBLIC: 'PUBLIC'
};
exports.GroupVisibilityTypes = GroupVisibilityTypes;
const GroupRequestProcessType = {
  ACCEPT_GROUP_REQUEST: 'ACCEPT_GROUP_REQUEST',
  REJECT_GROUP_REQUEST: 'REJECT_GROUP_REQUEST'
};
exports.GroupRequestProcessType = GroupRequestProcessType;
const redis = {
  host: 'localhost',
  port: 6379
};
exports.redis = redis;
const socket = {
  port: 3000
};
exports.socket = socket;
const publicAnnouncementUrl = '/home/ubuntu/kliq-BE/public/uploads'; // export const publicAnnouncementUrl = 'D:/Projects/KLIQ/kliq-BE/public/uploads';
// export const apiUrl = "http://localhost:3000";

exports.publicAnnouncementUrl = publicAnnouncementUrl;
const apiUrl = "http://localhost";
exports.apiUrl = apiUrl;
const notificationQueue = 'notificationMQ';
exports.notificationQueue = notificationQueue;
const apiKey = "e3Gc3Zt4Ku";
exports.apiKey = apiKey;