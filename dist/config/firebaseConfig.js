"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serviceAccount = require('./kliq-3b5af-firebase-adminsdk-slv49-54a9e35eb7.json');

var _default = _firebaseAdmin.default.initializeApp({
  credential: _firebaseAdmin.default.credential.cert(serviceAccount)
});

exports.default = _default;