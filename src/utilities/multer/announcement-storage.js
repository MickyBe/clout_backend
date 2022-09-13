import multer from 'multer';
import { publicAnnouncementUrl } from '../../config/constants';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, publicAnnouncementUrl);
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (request, file, callback) => {
    callback(null, true);
  },
});

export default upload;
