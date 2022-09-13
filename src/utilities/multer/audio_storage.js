import multer from 'multer';
import { publicAudioUrl } from '../../config/constants';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, publicAudioUrl);
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
