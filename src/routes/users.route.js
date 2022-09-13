import controller from '../controllers/users.controller';
import express from 'express';
import MinimalAuthorization from '../utilities/middlewares/minimal.middleware';
// import multer from 'multer';
import uploader from '../utilities/multer/storage';
import ApiKeyAuthorization from '../utilities/middlewares/api-key.middleware';
// const up = uploader.single('image');

// const upload = multer({ dest: '../../public/uploads/' });

let router = express.Router();

router
  .get('/email/:email', ApiKeyAuthorization, controller.getByEmail)
  .get('/username/:username', ApiKeyAuthorization, controller.getByUserName)
  .get('/profile', MinimalAuthorization, controller.getProfile)
  .get('/suggestion', MinimalAuthorization, controller.getSuggestion)
  .get('/request', MinimalAuthorization, controller.requests)
  .get('/', MinimalAuthorization, controller.getAll)
  .get('/location', MinimalAuthorization, controller.getAll)
  .get('/friends', MinimalAuthorization, controller.getAll)
  .get('/locationhistory', MinimalAuthorization, controller.getAll)
  .get('/data', MinimalAuthorization, controller.getUserData)
  .get('/search', MinimalAuthorization, controller.searchUser)
  .get('/:id', MinimalAuthorization, controller.getOne)
  .put('/process-request', MinimalAuthorization, controller.proccessRequest)
  .put('/change-visibility', MinimalAuthorization, controller.changeVisibility)
  .put(
    '/process-group-request',
    MinimalAuthorization,
    controller.processGroupRequest
  )
  .post('/', MinimalAuthorization, controller.createOne)
  .put('/', MinimalAuthorization, uploader.single('image'), controller.update)
  .delete('/:id', MinimalAuthorization, controller.deleteOne);

export default router;
