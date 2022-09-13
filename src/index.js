import { server, sequelize, socket,redisServer } from './app';

(async () => {
  try {
    await sequelize.sync({ force: false });
    const PORT = process.env.PORT || 3000;
    redisServer.on('error', (err) => console.log('Redis Client Error', err));
    redisServer.on('connect', function(){
      console.log('Connected to Redis...=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    });
    await socket();
    server.listen(PORT, () =>
      // eslint-disable-next-line no-console
      console.log(`Server running on port socket ${PORT}`)
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
