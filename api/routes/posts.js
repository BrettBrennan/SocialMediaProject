const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const posts = require("../controllers/post.controller");

// ?@route GET api/posts
// ?@desc Get a post
// ?@access Public or Private depending on poster's preference.abs

router.get("/", posts.find);

// ?@route POST api/posts
// ?@desc Create a post
// ?@access Private

router.post("/", posts.create);

// ?@route PUT api/posts
// ?@desc Edit a post
// ?@access Private

router.put("/:id", posts.update);

// ?@route DELETE api/posts
// ?@desc Delete a post
// ?@access Private

router.delete("/:id", posts.delete);

module.exports = router;
