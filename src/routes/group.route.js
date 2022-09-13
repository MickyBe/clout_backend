import groupController from '../controllers/group.controller';
import express from 'express';
import MinimalAuthorization from '../utilities/middlewares/minimal.middleware';

let router = express.Router();

router
  .get('/', MinimalAuthorization, groupController.getAll)
  .post('/', MinimalAuthorization, groupController.create)
  .put('/add-members/:id', MinimalAuthorization, groupController.addMem)
  .put('/change-visibility', MinimalAuthorization, groupController.changeVisibilityGroup)
  .put('/:id', MinimalAuthorization, groupController.removeFromGroup)
  .put('/update/:id', MinimalAuthorization, groupController.updateGroup)
  .delete('/:id', MinimalAuthorization, groupController.delete);

export default router;
