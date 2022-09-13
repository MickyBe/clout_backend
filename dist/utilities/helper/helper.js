"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNUll = exports.UrlWrapper = void 0;

var _constants = require("../../config/constants");

const isNUll = myVar => {
  if (typeof myVar === 'undefined' || myVar === null || myVar === 'undefined') return true;
  return false;
};

exports.isNUll = isNUll;

const UrlWrapper = fileName => {
  return `${_constants.apiUrl}/${fileName}`;
};

exports.UrlWrapper = UrlWrapper;