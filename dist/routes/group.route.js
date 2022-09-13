"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _group = _interopRequireDefault(require("../controllers/group.controller"));

var _express = _interopRequireDefault(require("express"));

var _minimal = _interopRequireDefault(require("../utilities/middlewares/minimal.middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express.default.Router();

router.get('/', _minimal.default, _group.default.getAll).post('/', _minimal.default, _group.default.create).put('/add-members/:id', _minimal.default, _group.default.addMem).put('/change-visibility', _minimal.default, _group.default.changeVisibilityGroup).put('/:id', _minimal.default, _group.default.removeFromGroup).put('/update/:id', _minimal.default, _group.default.updateGroup).delete('/:id', _minimal.default, _group.default.delete);
var _default = router;
exports.default = _default;