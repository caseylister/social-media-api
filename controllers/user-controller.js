const { User, Thought } = require("../models");

const userController = {
  // GET all users
  getUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET users by id /api/users/:id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // create user (POST)
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  // update user (PUT)
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
    { _id: params.id },
    body,
    { new: true, runValidators: true })
    .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this ID!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE /api/users/:id
  removeUser({ params}, res){
      Thought.deleteMany({ userId: params.id })
      .then(() => {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
      })
      .catch(err => res.json(err));
  },

  // add friend (POST)
  addFriend({ params }, res){
      User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { friends: params.friendId } },
          { new: true, runValidators: true }
      )
      .then(dbUserData => {
          if(!dbUserData){
              res.status(404).json({ message: 'No user found with this id!' });
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove friend (DELETE)
  removeFriend({ params }, res){
      User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
      )
      .then((dbUserData => {
          if(!dbUserData){
              res.status(404).json({ message: 'No user found with this id!' });
              return;
          }
          res.json(dbUserData);
      }))
      .catch(err => res.json(err));
  }
};

module.exports = userController;
