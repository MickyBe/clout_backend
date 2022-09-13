var amqp = require('amqplib/callback_api');
const CONN_URL = 'amqp://localhost';
amqp.connect(CONN_URL, function (err, conn) {
  if (err) console.log(err);
  conn.createChannel(function (err, ch) {
    if (err) console.log(err);
    ch.consume(
      'notificationMQ',
      function (msg) {
        console.log('..........................................');
        console.log('..........................................');
        console.log('..........................................');
        console.log('..........................................');
        // setTimeout(function () {
        //   console.log('Message:', msg.content.toString());
        // }, 4000);
      },
      { noAck: false }
    );
  });
});
