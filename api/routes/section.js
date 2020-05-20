const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const sections = require("../controllers/section.controller");
const auth = require("../middleware/auth");
// ?@route GET api/sections
// ?@desc Get a Section
// ?@access Public or Private depending on Sectioner's preference.abs

router.get("/:id", sections.findOne);

// ?@route POST api/sections
// ?@desc Create a Section
// ?@access Private

router.post(
    "/",
    [
        auth,
        [
            check("title", "Please add a title").not().isEmpty(),
            check("desc", "Please add a description").not().isEmpty(),
        ],
    ],
    sections.create
);

// ?@route PUT api/sections
// ?@desc Edit a Section
// ?@access Private

router.put("/:id", auth, sections.update);

// ?@route DELETE api/sections
// ?@desc Delete a Section
// ?@access Private

router.delete("/:id", auth, sections.delete);

module.exports = router;
