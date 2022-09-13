const Group = require('../models').Group;
const User = require('../models').User;
const UserGroup = require('../models').UserGroup;
import { groupRequest } from '../service/notification';
import {
  groupRequestLocation,
} from '../service/notification';
import {
  ChangeGroupVisibilityType,
} from '../config/constants';

exports.getAll = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: ['members', 'owner'],
    });
    return res.status(200).json(groups);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      emoji: req.body.emoji,
      visibility: req.body.visibility,
      owner_id: req.body.owner,
    };
    const group = await Group.create(data);
    const owner = await User.findByPk(req.body.owner);
    const members = await User.findAll({ where: { id: req.body.users } });
    if (req.body.users) {
      group.addMembers(req.body.users, { through: { isAccepted: false } });
    }
    groupRequestLocation(group.id,data.owner_id,req.uid, true,0);
    groupRequest(
      members.map((member) => member.uid),
      req.body.name,
      owner.username
    );
    return res.status(201).send(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.removeFromGroup = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    const member = await User.findByPk(req.body.memberId);
    group.removeMembers(req.body.memberId);

    return res.status(200).send(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.changeVisibilityGroup = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { uid: req.uid } });
    const group = await Group.findOne({ where: { id: req.body.groupId, owner_id:req.body.ownerId } });
    // const group = await Group.findByPk(req.params.id);
    const bool = req.query.type === ChangeGroupVisibilityType.ACCEPT_VISIBLE? true :req.query.type === ChangeGroupVisibilityType.REJECT_VISIBLE? false : null;
    console.log("we here with data",req.body, req.query.type, req.uid,bool);
    console.log("User", user);
    console.log("Group",group);
    // return;
    let data;
    
    if(bool==null){
      res.status(400).send({ error: false, message: 'INVALID REQUEST' });
      return
    }
    //notify friend in real time
    groupRequestLocation(req.body.groupId,req.body.ownerId,req.uid, bool,1);
    //update database
    if(user.id!=req.body.ownerId){
      data = await UserGroup.update({ userVisible: bool }, {
        where: {
          UserId:user.id,
          GroupId: req.body.groupId
        }
      });
    }else{
      data = await Group.update({ ownerVisible: bool }, {
        where: {
          owner_id:user.id,
          id: req.body.groupId
        }
      });
    }
    console.log("all information",bool,data); 
    res.status(201).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.addMem = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    group.addMembers(req.body.memberId);
    const member = await User.findByPk(req.body.memberId);
    groupRequest([member.uid], group.name, group.owner.username);
    return res.status(200).send(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.updateGroup = async (req, res, next) => {
  try {
    const groupData = {};
    if (req.body.emoji) groupData.emoji = req.body.emoji;
    if (req.body.name) groupData.name = req.body.name;
    await Group.update(groupData, {
      where: { id: req.params.id },
    });
    res.status(200).send(true);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleteResponse = await Group.destroy({
      where: { id: req.params.id },
    });
    return res.status(200).json(deleteResponse);
  } catch (err) {
    return res.status(500).json(err);
  }
};
