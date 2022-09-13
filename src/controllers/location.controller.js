const User = require('../models').User;
const Group = require('../models').Group;

module.exports = {
    //creat shoping the inishial shoping cart
    getFriends: async(id) => {
        try {
            console.log("we mufaking here",id);
            const ALL = await User.findOne({
                where: { uid: id },
                include: [
                  'userFriends',
                  'friends',
                ],
              });
            console.log("this is the friends",ALL);
        } catch (error) {
            console.log(`error`, error);
        }
    },
    // get friends location
    getlocation: async(req, res, next) => {
        try {
            console.log(`req.body`, req.body);
        } catch (error) {
            console.log(`error`, error);
            res.status(500).json("server error!");
        }
    },
    deletelocation: async(req, res, next) => {
        try {
        } catch (error) {
            console.log(`error`, error);
            res.status(500).json("server error!");
        }
    },
};