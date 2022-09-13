import announcementController from '../controllers/announcement.controller';
import express from 'express';
import MinimalAuthorization from '../utilities/middlewares/minimal.middleware';
import upload from '../utilities/multer/announcement-storage';

let router = express.Router();

router
  .get('/', MinimalAuthorization, announcementController.getAll)
  .get('/user', MinimalAuthorization, announcementController.getByUser)
  .post(
    '/',
    MinimalAuthorization,
    upload.fields([{name: 'image'}, {name: "audio"}]),
    announcementController.create
  )
  .delete('/:id', MinimalAuthorization, announcementController.delete);

export default router;
