const { Thought, User } = require('../models');

const thoughtController = {
    // get /api/thoughts
    getAllThoughts(req, res){
        Thought.find({})
        .populate({ path: 'user', select: '-__v'})
        .select('-__v')
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
    
}