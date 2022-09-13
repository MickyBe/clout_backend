"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _users = _interopRequireDefault(require("./users.route"));

var _group = _interopRequireDefault(require("./group.route"));

var _announcement = _interopRequireDefault(require("./announcement.route"));

var _locationHistory = _interopRequireDefault(require("./locationHistory.route"));

var _savedTrip = _interopRequireDefault(require("./saved-trip.route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = app => {
  app.use('/users', _users.default);
  app.use('/groups', _group.default);
  app.use('/announcement', _announcement.default);
  app.use('/location', _locationHistory.default);
  app.use('/saved-trips', _savedTrip.default);
};

var _default = routes;
exports.default = _default;