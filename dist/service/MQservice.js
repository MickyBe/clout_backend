"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publishToQueue = void 0;

var _callback_api = _interopRequireDefault(require("amqplib/callback_api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CONN_URL = 'amqp://localhost';
let ch = null;

_callback_api.default.connect(CONN_URL, function (err, conn) {
  if (err) console.log('ERROR >>>>> ', err);
  conn.createChannel(function (err, channel) {
    ch = channel;
  });
});

const publishToQueue = async (queueName, data) => {
  ch.sendToQueue(queueName, Buffer.from(data));
};

exports.publishToQueue = publishToQueue;
process.on('exit', code => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});