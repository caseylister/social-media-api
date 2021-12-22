const router = require('express').Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    removeUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');

// GET / POST for /api/users
router
    .route('/')
    .get(getUsers)
    .post(createUser)

// GET / PUT / DELETE for /api/users/:id
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(removeUser)

// POST / DELETE for users friends
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend)

module.exports = router;