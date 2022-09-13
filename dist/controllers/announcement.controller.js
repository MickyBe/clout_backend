"use strict";

var _sequelize = _interopRequireDefault(require("sequelize"));

var _helper = require("../utilities/helper/helper");

var _notification = require("../service/notification");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Announcement = require('../models').Announcement;

const User = require('../models').User;

const Op = _sequelize.default.Op;

exports.getAll = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      include: [{
        model: User,
        as: 'creator'
      }, {
        model: User,
        as: 'participators'
      }]
    });
    res.status(200).json(announcements);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getByUser = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      include: [{
        model: User,
        as: 'creator',
        where: {
          uid: req.uid
        },
        required: true
      }, {
        model: User,
        as: 'participators'
      }]
    });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const creator = await User.findOne({
      where: {
        id: req.body.creator_id
      }
    });
    const parts = await User.findAll({
      where: {
        id: req.body.participators.split('--').filter(participator => participator !== creator.id)
      }
    });
    const data = {};
    data.latitude = req.body.latitude;
    data.longitude = req.body.longitude;
    if (req.files.image) data.image = req.files.image[0].filename;
    if (req.files.audio) data.audio = req.files.audio[0].filename;
    if (!(0, _helper.isNUll)(req.body.description)) data.description = req.body.description;
    if (!(0, _helper.isNUll)(req.body.creator_id)) data.creator_id = req.body.creator_id;
    const announcement = await Announcement.create(data);
    announcement.addParticipators(req.body.participators.split('--'));
    (0, _notification.sendAnnouncement)(parts.map(part => part.uid).filter(part => part.uid !== creator.uid), {
      id: creator.uid,
      creator: creator.username,
      profileImage: creator.profileImage,
      location: [req.body.latitude, req.body.longitude],
      description: req.body.description,
      image: req.files.image ? req.files.image[0].filename : null,
      audio: req.files.audio ? req.files.audio[0].filename : null,
      created_at: announcement.created_at
    });
    res.status(200).json(true);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const announcementRes = await Announcement.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(announcementRes);
  } catch (err) {
    res.status(500).json(err);
  }
};