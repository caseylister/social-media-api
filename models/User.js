const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: 'Username is required!',
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address!']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]    
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// get count of comments and replies
UserSchema.virtual('friendCount').get(function(){
    return this.friends.length
});

// create User model from schema
const User = model('User', UserSchema);

module.exports = User;