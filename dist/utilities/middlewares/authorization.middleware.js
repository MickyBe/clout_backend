"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firebaseConfig = _interopRequireDefault(require("../../config/firebaseConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AuthorizationMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  try {
    if (!header) {
      return res.status(403).json({
        error: 'User not authorized'
      });
    } else {
      const tkArr = header.split(' ');

      if (tkArr.length > 1) {
        const token = tkArr[1];
        const tokenUser = await _firebaseConfig.default.auth().verifyIdToken(token);
        req.uid = tokenUser.uid;
        next();
      }

      return res.status(403).json({
        error: 'User not authorized'
      });
    }
  } catch (err) {
    return res.status(403).json({
      error: 'User not authorized'
    });
  }
};

var _default = AuthorizationMiddleware;
exports.default = _default;