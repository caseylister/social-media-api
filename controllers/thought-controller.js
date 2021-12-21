const { Thought, User } = require('../models');

const thoughtController = {
    // get /api/thoughts
    getAllThoughts(req, res){
        Thought.find({})
        .populate({ path: 'user', select: '-__v'})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // get thoughts by id
    getThoughtById({ params }, res){
        Thought.findOne({ _id: params.id })
        .populate({ path: 'user', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // createThought (POST)
    createThought({ body }, res){
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { username: body.username },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
            .then(dbUserData => {
                if(!dbUserData){
                    res.status(404).json({ message: 'No user found with this username!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // updateThought by id (PUT)
    updateThought({ params, body}, res){
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
        .then(updatedThought => {
            if(!updatedThought){
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(updatedThought);
        })
        .catch(err => res.json(err));

    },

    // DELETE thought by id
    removeThought({ params }, res){
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if(!dbThoughtData){
                return res.status(404).json({ message: 'No thought found with this id!' });
            }
            // remove ref to delete thought in user's thoughts
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.Id } },
                { new: true }
            )
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // POST reaction /api/thoughts/:thoughtId/reactions
    createReaction({ params, body}, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    },

    // DELETE reaction by reactionId
    removeReaction({ params }, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;