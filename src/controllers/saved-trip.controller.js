const SavedTrips = require('../models').savedTrips;
const User = require('../models').User;

exports.getAll = async (req, res, next) => {
  try {
    const ALL = await SavedTrips.findAll({
      include: ['locations', {model: User, as: 'user'}],
    });
    res.status(200).json(ALL);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.uid });
    const data = {
      name: req.body.name,
      date: req.body.date,
      user_id: user.id,
    };
    const savedTrip = await SavedTrips.create(data);
    savedTrip.addLocations(req.body.locations);
    return res.status(201).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleteResponse = await SavedTrips.destroy({
      where: { id: req.params.id },
    });
    return res.status(200).json(deleteResponse);
  } catch (err) {
    return res.status(500).json(err);
  }
};
