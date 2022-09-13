"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../../config/constants");

const ApiKeyAuthorization = async (req, res, next) => {
  const header = req?.headers;

  if (header) {
    if (header.authorization) {
      const auth = header.authorization;

      if (auth == _constants.apiKey) {
        req.uid = auth;
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

var _default = ApiKeyAuthorization;
exports.default = _default;