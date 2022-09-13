"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storage = _multer.default.diskStorage({
  destination(req, file, callback) {
    callback(null, _constants.publicAudioUrl);
  },

  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  }

});

const upload = (0, _multer.default)({
  storage
});
var _default = upload;
exports.default = _default;