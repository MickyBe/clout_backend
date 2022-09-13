const User = require('../models').User;
const Group = require('../models').Group;

module.exports = {
  getProfile: async(key,next) => {
    try {
        console.log("we here ============================================================",key);
        // create redice instance

        // update status to online
        const userData = {};
        userData.online = true;
        console.log(userData);
        //get friends that are online
        const ALL = await User.findOne({
            where: { uid: key }});
        
        const {id, uid, username, bio, profileImage, email} = ALL;
        if(ALL){
          next(username, profileImage);
        }else{
          next('', null);
        }
        return ALL;
    } catch (error) {
        console.log(`error`, error);
    }
},
    //get friends information for realtime -location purposes
    getFriends: async(key,next) => {
        try {
            console.log("we here",key);
            // create redice instance

            // update status to online
            const userData = {};
            userData.online = true;
            console.log(userData);
            const updatedUser = await User.update(userData, {
              where: { uid: key },
            });
            
            //get friends that are online
            const ALL = await User.findOne({
                where: { uid: key },
                include: [
                  {
                    model: User,
                    as: 'friends',
                    through: {
                      where: {
                        isAccepted: true,
                        friendVisible:true,
                        userVisible: true,
                      },
                    },
                  },
                  {
                    model: User,
                    as: 'userFriends',
                    through: {
                      where: {
                        isAccepted: true,
                        userVisible: true,
                        friendVisible:true,
                      },
                    },
                  },
                ],
              });
            const {id, uid, username, bio, profileImage, email, online,friends,userFriends} = ALL;

            const Person = {id, uid, username, bio, profileImage, email, online};
            const Friends=[...friends, ...userFriends];
            next(Person,Friends);
            return {Person,Friends}
        } catch (error) {
            console.log(`error`, error);
        }
    },
    // change the location visibility of a user
    updateVisibility: async(req, res, next) => {
        try {
            console.log(`req.body`, req.body);
        } catch (error) {
            console.log(`error`, error);
            res.status(500).json("server error!");
        }
    },
    //get groups that the user is active on
    getGroups: async(key,next) => {
      try {
          console.log("we here",key);
          // create redice instance

          //
          // update status to online
          //get friends that are online
          const ALL = await User.findOne({
            where: { uid: key },
            include: [
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

            //get users that are not blocked
            const ALLNotBlocked = await User.findOne({
              where: { uid: key },
              include: [
                {
                  model: Group,
                  as: 'groups',
                  through: { where: { isAccepted: true,userVisible:true } },
                  include: {
                    model: User,
                    as: 'members',
                    through: { where: { isAccepted: true, } },
                  },
                },
              ],
            });
            const {groups, ugroups,id, uid, username, bio, profileImage, email,owner_id} = ALL;
            //owens the group
            const ALLNotBlockedOwened = await Group.findAll({
                where: { owner_id: id, ownerVisible:true },
                include: ['members', 'owner'],
              });

          // console.log("ALLNotBlockedOwened",ALLNotBlockedOwened);
          
          const Groups=[...groups, ...ugroups];
          // console.log("Groups",Groups);
          // const Owner = Groups[0]?.owner_id;
          
          const GroupsUnblocked=[...ALLNotBlocked.groups,...ALLNotBlockedOwened];
          const Owner = GroupsUnblocked[0]?.owner_id;
          console.log("Owner",Owner);
          console.log("GroupsUnblocked",GroupsUnblocked);
          console.log("ALLNotBlocked.groups",ALLNotBlocked.groups);
          next(Owner,Groups,GroupsUnblocked);
          return {Owner,Groups,GroupsUnblocked}
      } catch (error) {
          console.log(`error`, error);
      }
  },
    // Signe out visability
    signOutVisibility: async(key) => {
      try {
          // update status to online
          const userData = {};
          userData.online = false;
          console.log(userData);
          const updatedUser = await User.update(userData, {
            where: { uid: key },
          });
          console.log(`user left`, updatedUser);
          return true;
      } catch (error) {
          console.log(`error`, error);
          return false;
      }
  },
};