const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const comments = require("../controllers/comment.controller");
const auth = require("../middleware/auth");
// ?@route GET api/comments
// ?@desc Get a Comment
// ?@access Public or Private depending on Commenter's preference.

router.get("/:id", comments.findOne);

// ?@route POST api/comments
// ?@desc Create a Comment
// ?@access Private

router.post("/", auth, comments.create);

// ?@route PUT api/comments
// ?@desc Edit a Comment
// ?@access Private

router.put("/:id", auth, comments.update);

// ?@route DELETE api/comments
// ?@desc Delete a Comment
// ?@access Private

router.delete("/:id", auth, comments.delete);

module.exports = router;
