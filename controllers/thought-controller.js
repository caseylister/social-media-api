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

    }


}