import controller from '../controllers/saved-trip.controller';
import express from 'express';
import MinimalAuthorization from '../utilities/middlewares/minimal.middleware';
// import multer from 'multer';
// import uploader from '../utilities/multer/storage';
// const up = uploader.single('image');

// const upload = multer({ dest: '../../public/uploads/' });

let router = express.Router();

router.get('/', MinimalAuthorization, controller.getAll);
router.post('/', MinimalAuthorization, controller.create);
router.delete('/:id', MinimalAuthorization, controller.delete);

export default router;
