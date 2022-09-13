import amqp from 'amqplib/callback_api';
const CONN_URL = 'amqp://localhost';
let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
  if (err) console.log('ERROR >>>>> ', err);
  conn.createChannel(function (err, channel) {
    ch = channel;
  });
});
export const publishToQueue = async (queueName, data) => {
  ch.sendToQueue(queueName, Buffer.from(data));
};
process.on('exit', (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});
