import userRoutes from './users.route';
import groupRoutes from './group.route';
import announcementRoutes from './announcement.route';
import locationHistoryRoutes from './locationHistory.route';
import savedTripRoutes from './saved-trip.route';

const routes = (app) => {
  app.use('/users', userRoutes);
  app.use('/groups', groupRoutes);
  app.use('/announcement', announcementRoutes);
  app.use('/location', locationHistoryRoutes);
  app.use('/saved-trips', savedTripRoutes);
};

export default routes;
