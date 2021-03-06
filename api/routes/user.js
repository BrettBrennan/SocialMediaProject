const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const users = require('../controllers/user.controller');
const auth = require('../middleware/auth');
// @route GET api/users
// @desc Get a user
// @access Public

router.get('/:id', users.findOne);

// @route   POST api/users
// @desc    Register a user
// @access  Public

// @route   PUT api/users
// @desc    Update a user
// @access  Public
router.put('/:id', auth, users.update);

// router.post(
//     "/",
//     [
//         check("name", "Please add a name").not().isEmpty(),
//         check("email", "Please include a valid email").isEmail(),
//         check(
//             "password",
//             "Please enter a password with 6 or more characters"
//         ).isLength({ min: 6 }),
//     ],
//     users.create
// );

module.exports = router;
