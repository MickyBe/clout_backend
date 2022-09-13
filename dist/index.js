"use strict";

var _app = require("./app");

(async () => {
  try {
    await _app.sequelize.sync({
      force: false
    });
    const PORT = process.env.PORT || 3000;

    _app.redisServer.on('error', err => console.log('Redis Client Error', err));

    _app.redisServer.on('connect', function () {
      console.log('Connected to Redis...=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    });

    await (0, _app.socket)();

    _app.server.listen(PORT, () => // eslint-disable-next-line no-console
    console.log(`Server running on port socket ${PORT}`));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();