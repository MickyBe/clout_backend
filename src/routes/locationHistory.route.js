import locationHistoryController from '../controllers/locationHistory.controller';
import express from 'express';
import MinimalAuthorization from '../utilities/middlewares/minimal.middleware';
import uploader from '../utilities/multer/storage';

let router = express.Router();

router
  .get('/', MinimalAuthorization, locationHistoryController.getAll)
  .get('/date', MinimalAuthorization, locationHistoryController.getByDate)
  .post('/', MinimalAuthorization, locationHistoryController.create);

export default router;
