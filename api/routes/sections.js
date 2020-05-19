const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const sections = require("../controllers/section.controller");

// ?@route GET api/sections
// ?@desc Get a Section
// ?@access Public or Private depending on Sectioner's preference.abs

router.get("/", sections.find);

// ?@route POST api/sections
// ?@desc Create a Section
// ?@access Private

router.post("/", sections.create);

// ?@route PUT api/sections
// ?@desc Edit a Section
// ?@access Private

router.put("/:id", sections.update);

// ?@route DELETE api/sections
// ?@desc Delete a Section
// ?@access Private

router.delete("/:id", sections.delete);
