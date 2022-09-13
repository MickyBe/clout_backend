"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationChannel = exports.locationChannel = exports.groupLocationChannel = exports.announcementChannel = void 0;

const notificationChannel = uid => {
  return `notification-${uid}`;
};

exports.notificationChannel = notificationChannel;

const announcementChannel = uid => {
  return `announcement-${uid}`;
};

exports.announcementChannel = announcementChannel;

const locationChannel = uid => {
  return `location-s`;
};

exports.locationChannel = locationChannel;

const groupLocationChannel = uid => {
  return `group-location-s`;
};

exports.groupLocationChannel = groupLocationChannel;