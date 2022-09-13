"use strict";

var _notification = require("../service/notification");

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LocationHistory = require('../models').LocationHistory;

const User = require('../models').User;

const Op = _sequelize.default.Op;

exports.getAll = async (req, res, next) => {
  try {
    const location = await LocationHistory.findAll({
      include: ['user']
    });
    return res.status(200).json(location);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getByDate = async (req, res, next) => {
  try {
    console.log(req.query);
    const location = await LocationHistory.findAll({
      where: {
        createdAt: {
          [Op.between]: [req.query.start_date, req.query.end_date]
        }
      },
      include: [{
        model: User,
        as: 'user',
        where: {
          uid: req.uid
        }
      }]
    });
    return res.status(200).json(location);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uid: req.uid
      }
    });
    const data = {
      latitude: req.body[0].latitude,
      longitude: req.body[0].longitude,
      user_id: user.id
    };
    const location = await LocationHistory.create(data);
    return res.status(201).send(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};