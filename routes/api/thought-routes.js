const router = require("express").Router();

const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  removeThought,
  createReaction,
  removeReaction,
} = require("../../controllers/thought-controller");

// GET / POST for /api/thoughts
router.route("/")
    .get(getAllThoughts)
    .post(createThought);

// GET / PUT / DELETE for /api/thoughts/:id
router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);

// POST for /api/thoughts/:thoughtId/reactions
router
    .route("/:thoughtId/reactions")
    .post(createReaction);

// DELETE reaction
router
    .route("/:thoughtId/reactions/:reactionId")
    .delete(removeReaction);

module.exports = router;
