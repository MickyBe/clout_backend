"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const MinimalAuthorization = async (req, res, next) => {
  const header = req?.headers;

  if (header) {
    if (header.authorization) {
      const auth = header.authorization;

      if (auth.split(' ').length > 1) {
        req.uid = auth.split(' ')[1];
        next();
        return;
      }
    }
  }

  res.status(403).send({
    error: 'User not authorized'
  });
  return;
};

var _default = MinimalAuthorization;
exports.default = _default;