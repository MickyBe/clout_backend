"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _users = _interopRequireDefault(require("../controllers/users.controller"));

var _express = _interopRequireDefault(require("express"));

var _minimal = _interopRequireDefault(require("../utilities/middlewares/minimal.middleware"));

var _storage = _interopRequireDefault(require("../utilities/multer/storage"));

var _apiKey = _interopRequireDefault(require("../utilities/middlewares/api-key.middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import multer from 'multer';
// const up = uploader.single('image');
// const upload = multer({ dest: '../../public/uploads/' });
let router = _express.default.Router();

router.get('/email/:email', _apiKey.default, _users.default.getByEmail).get('/username/:username', _apiKey.default, _users.default.getByUserName).get('/profile', _minimal.default, _users.default.getProfile).get('/suggestion', _minimal.default, _users.default.getSuggestion).get('/request', _minimal.default, _users.default.requests).get('/', _minimal.default, _users.default.getAll).get('/location', _minimal.default, _users.default.getAll).get('/friends', _minimal.default, _users.default.getAll).get('/locationhistory', _minimal.default, _users.default.getAll).get('/data', _minimal.default, _users.default.getUserData).get('/search', _minimal.default, _users.default.searchUser).get('/:id', _minimal.default, _users.default.getOne).put('/process-request', _minimal.default, _users.default.proccessRequest).put('/change-visibility', _minimal.default, _users.default.changeVisibility).put('/process-group-request', _minimal.default, _users.default.processGroupRequest).post('/', _minimal.default, _users.default.createOne).put('/', _minimal.default, _storage.default.single('image'), _users.default.update).delete('/:id', _minimal.default, _users.default.deleteOne);
var _default = router;
exports.default = _default;