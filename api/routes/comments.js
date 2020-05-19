const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const comments = require("../controllers/comment.controller");

// ?@route GET api/comments
// ?@desc Get a Comment
// ?@access Public or Private depending on Commenter's preference.abs

router.get("/", comments.find);

// ?@route POST api/comments
// ?@desc Create a Comment
// ?@access Private

router.post("/", comments.create);

// ?@route PUT api/comments
// ?@desc Edit a Comment
// ?@access Private

router.put("/:id", comments.update);

// ?@route DELETE api/comments
// ?@desc Delete a Comment
// ?@access Private

router.delete("/:id", comments.delete);

module.exports = router;
