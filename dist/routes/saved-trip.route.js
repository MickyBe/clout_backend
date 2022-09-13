"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _savedTrip = _interopRequireDefault(require("../controllers/saved-trip.controller"));

var _express = _interopRequireDefault(require("express"));

var _minimal = _interopRequireDefault(require("../utilities/middlewares/minimal.middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import multer from 'multer';
// import uploader from '../utilities/multer/storage';
// const up = uploader.single('image');
// const upload = multer({ dest: '../../public/uploads/' });
let router = _express.default.Router();

router.get('/', _minimal.default, _savedTrip.default.getAll);
router.post('/', _minimal.default, _savedTrip.default.create);
router.delete('/:id', _minimal.default, _savedTrip.default.delete);
var _default = router;
exports.default = _default;