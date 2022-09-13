"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _locationHistory = _interopRequireDefault(require("../controllers/locationHistory.controller"));

var _express = _interopRequireDefault(require("express"));

var _minimal = _interopRequireDefault(require("../utilities/middlewares/minimal.middleware"));

var _storage = _interopRequireDefault(require("../utilities/multer/storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express.default.Router();

router.get('/', _minimal.default, _locationHistory.default.getAll).get('/date', _minimal.default, _locationHistory.default.getByDate).post('/', _minimal.default, _locationHistory.default.create);
var _default = router;
exports.default = _default;