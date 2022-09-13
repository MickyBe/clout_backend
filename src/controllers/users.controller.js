const User = require('../models').User;
const UserFriend = require('../models').UserFriend;
const Group = require('../models').Group;
import Sequelize from 'sequelize';
const Op = Sequelize.Op;
import {
  RequestProcessType,
  ChangeVisibilityType,
  GroupRequestProcessType,
} from '../config/constants';
import { isNUll } from '../utilities/helper/helper';
import {
  requestSent,
  requestRejected,
  requestAccepted,
  requestAcceptedLocation,
  groupRequestLocation
} from '../service/notification';

exports.getAll = async (req, res, next) => {
  try {
    const ALL = await User.findAll({
      include: [
        'userFriends',
        'friends',
        'groups',
        'announcements',
        'uannouncements',
        {
          model: Group,
          as: 'ugroups',
          include: { model: User, as: 'members' },
        },
      ],
    });
    res.status(200).json(ALL);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.params.email}});
    res.status(200).json(user);
  }catch (err) {
    res.status(500).json(err);
  }
}

exports.getByUserName = async (req, res, next) => {
  try {
    const user = await User.findOne({where: {username: req.params.username}});
    res.status(200).json(user);
  }catch (err) {
    res.status(500).json(err);
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await User.findOne({
      where: { uid: req.uid },
      include: ['userFriends', 'friends'],
    });
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getSuggestion = async (req, res, next) => {
  try {
    let friends = await User.findOne({
      where: { uid: req.uid },
      include: ['friends', 'userFriends'],
    });
    const friendsArr = [...friends.friends, ...friends.userFriends].map(
      (fri) => fri.uid
    );
    friendsArr.push(req.uid);

    const users = await User.findAll({
      where: {
        uid: { [Op.not]: friendsArr },
        // [Op.and]: [
        //   { uid: { [Op.not]: req.uid } },
        //   { uid: { [Op.not]: friendsArr } },
        // ],
      },
      include: ['friends', 'userFriends'],
    });

    //TODO change the implementation to querying
    res.status(200).json(
      users
        .filter((user) => {
          const truthArr = [...user.friends, ...user.userFriends].map((fri) =>
            fri.uid === req.uid ? true : false
          );
          if (!truthArr.includes(true)) {
            return user;
          }
        })
        .filter((e) => e)
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.requests = async (req, res, next) => {
  try {
    const ALL = await User.findOne({
      where: { uid: req.uid },
      include: [
        'friends',
        {
          model: User,
          as: 'userFriends',
          through: {
            where: {
              isAccepted: false,
            },
          },
        },
        {
          model: Group,
          as: 'groups',
          through: {
            where: {
              isAccepted: false,
            },
          },
        },
      ],
    });
    res.status(200).json(ALL);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.searchUser = async (req, res, next) => {
  if (req.query.key.length < 2) {
    res.status(200).send([]);
  } else {
    try {
      const user = await User.findAll({
        where: { uid: req.uid },
        include: [
          {
            model: User,
            as: 'userFriends',
            where: {
              username: { [Op.like]: `%${req.query.key.toLowerCase()}%` },
            },
            through: {
              where: {
                isAccepted: true,
              },
            },
          },
          'friends',
        ],
      });
      res.status(200).send(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

exports.getUserData = async (req, res, next) => {
  try {
    console.log(req.query);
    const ALL = await User.findOne({
      where: { uid: req.uid },
      include: [
        {
          model: User,
          as: 'friends',
          through: {
            where: {
              isAccepted: true,
            },
          },
        },
        {
          model: User,
          as: 'userFriends',
          through: {
            where: {
              isAccepted: true,
            },
          },
        },
        {
          model: Group,
          as: 'groups',
          through: { where: { isAccepted: true } },
          include: {
            model: User,
            as: 'members',
            through: { where: { isAccepted: true } },
          },
        },
        {
          model: Group,
          as: 'ugroups',
          include: {
            model: User,
            as: 'members',
            through: { where: { isAccepted: true } },
          },
        },
      ],
    });
    res.status(200).json(ALL);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.proccessRequest = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { uid: req.uid } });
    const friend = await User.findOne({ where: { id: req.body.friendId } });
    if (req.query.type === RequestProcessType.ACCEPT_REQUEST) {
      requestAccepted(friend.uid, user.username);
      requestAcceptedLocation(friend.uid, req.uid, req.body.friendId, user.id,true,0, true);
      user.addUserFriends(req.body.friendId, { through: { isAccepted: true } });
    } else if (req.query.type === RequestProcessType.REJECT_REQUEST) {
      requestRejected(friend.uid, user.username);
      user.removeUserFriends(req.body.friendId);
    } else if (req.query.type === RequestProcessType.SEND_REQUEST) {
      requestSent(friend.uid, user.username);
      user.addFriends(friend.id);
    } else {
      res.status(400).send({ error: false, message: 'INVALID REQUEST' });
    }
    res.status(201).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
exports.changeVisibility = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { uid: req.uid } });
    const friend = await User.findOne({ where: { id: req.body.friendId } });
    const bool = req.query.type === ChangeVisibilityType.ACCEPT_VISIBLE? true :req.query.type === ChangeVisibilityType.REJECT_VISIBLE? false : null;
    console.log("we here with data",req.body.friendId,req.body, req.query.type, user.id);
    let data;
    let friendVisibility;
    if(req.body.userType==1){
      friendVisibility = await UserFriend.findOne({ where: { user_id:user.id,friend_id: req.body.friendId } });
      friendVisibility = friendVisibility.friendVisible;
    }else{
      friendVisibility = await UserFriend.findOne({ where: { user_id: req.body.friendId, friend_id: user.id } });
      friendVisibility = friendVisibility.userVisible;
    }
    if(bool==null){
      res.status(400).send({ error: false, message: 'INVALID REQUEST' });
      return
    }
    //notify friend in real time
    requestAcceptedLocation(friend.uid, req.uid, req.body.friendId, user.id,bool,1,friendVisibility);
    //update database
    if(req.body.userType==1){
      data = await UserFriend.update({ userVisible: bool }, {
        where: {
          user_id:user.id,
          friend_id: req.body.friendId
        }
      });
    }else{
      data = await UserFriend.update({ friendVisible: bool }, {
        where: {
          user_id:req.body.friendId,
          friend_id: user.id
        }
      });
    }
    console.log("all information",bool,data);
    // if (req.query.type === ChangeVisibilityType.ACCEPT_VISIBLE) {
    //   // requestAccepted(friend.uid, user.username);
    //   // requestAcceptedLocation(friend.uid, user.username, req.uid);
    //   if(req.body.userType==1){
    //     user.addUserFriends(req.body.friendId, { through: { userVisible: true } });
    //   }else{
    //     friend.addUserFriends(req.body.friendId, { through: { friendVisible: true } });
    //   }
    // } else if (req.query.type === ChangeVisibilityType.REJECT_VISIBLE) {
    //   // requestRejected(friend.uid, user.username);
    //   if(req.body.userType==1){
    //     user.addUserFriends(req.body.friendId, { through: { userVisible: false } });
    //   }else{
    //     friend.addUserFriends(req.body.friendId, { through: { friendVisible: false } });
    //   }
    // } 
    res.status(201).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
exports.processGroupRequest = async (req, res, next) => {
  try {
    console.log("input",req.body);
    const user = await User.findOne({ where: { uid: req.uid } });
    const group = await Group.findOne({ where: { id: req.body.groupId } });
    if (req.query.type === GroupRequestProcessType.ACCEPT_GROUP_REQUEST) {
      groupRequestLocation(req.body.groupId,group.owner_id,req.uid, true,0);
      user.addGroups(req.body.groupId, { through: { isAccepted: true } });
    } else if (
      req.query.type === GroupRequestProcessType.REJECT_GROUP_REQUEST
    ) {
      user.removeGroups(req.body.groupId);
    } else {
      res.status(400).send({ error: false, message: 'INVALID REQUEST' });
    }
    res.status(201).send(true);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createOne = async (req, res, next) => {
  const userdata = {
    username: req.body.username.toLowerCase(),
    uid: req.uid,
    email: req.body.email.toLowerCase(),
  };
  try {
    const existingUserName = await User.findAll({
      where: { username:userdata.username },
    });
    const existingEmail = await User.findAll({
      where: { email: userdata.email },
    });
    //check database
    if(existingUserName.length>0 || existingEmail.length>0){
      res.status(409).json("email or username is taken");
    }else{
      //transaction must be implemented here
    // const userlocationdata = {};
    const user = await User.create(userdata);
    // userlocationdata.owner_id=user.id;
    console.log("user",user);
    // const userlocation = await Location.create(userlocationdata);
    // console.log("userlocation",userlocation);
    // user.addFriend(req.body.friendId, { through: { isAccepted: true } });
    if (req.body.friend) {
      const singleById = await User.findByPk(req.body.friend);
      user.addFriends(singleById, { through: { isAccepted: false } });
    }
    res.status(201).json(user);
    }
  } catch (error) {
    console.log("ERROR >>>> ", error);
    res.status(500).json(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userData = {};
    if (req.file) userData.profileImage = req.file.filename;
    if (!isNUll(req.body.username)) userData.username = req.body.username;
    if (!isNUll(req.body.bio)) userData.bio = req.body.bio;
    console.log(userData);
    await User.update(userData, {
      where: { uid: req.uid },
    });
    // const user = await User.findOne({ where: { uid: req.uid } });
    res.status(200).send(true);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const user = await User.destroy({ where: { id: req.params.id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};
