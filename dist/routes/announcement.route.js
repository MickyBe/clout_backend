"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _announcement = _interopRequireDefault(require("../controllers/announcement.controller"));

var _express = _interopRequireDefault(require("express"));

var _minimal = _interopRequireDefault(require("../utilities/middlewares/minimal.middleware"));

var _announcementStorage = _interopRequireDefault(require("../utilities/multer/announcement-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express.default.Router();

router.get('/', _minimal.default, _announcement.default.getAll).get('/user', _minimal.default, _announcement.default.getByUser).post('/', _minimal.default, _announcementStorage.default.fields([{
  name: 'image'
}, {
  name: "audio"
}]), _announcement.default.create).delete('/:id', _minimal.default, _announcement.default.delete);
var _default = router;
exports.default = _default;