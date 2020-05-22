const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const posts = require('../controllers/post.controller');
const auth = require('../middleware/auth');

// ?@route GET api/post
// ?@desc Get a post
// ?@access Public or Private depending on poster's preference.abs

router.get('/:id', posts.findOne);

// ?@route POST api/post
// ?@desc Create a post
// ?@access Private

router.post(
	'/',
	[
		auth,
		[
			check('title', 'Please add a title').not().isEmpty(),
			check('body', 'Please add a body').not().isEmpty(),
		],
	],
	posts.create
);

// ?@route PUT api/post
// ?@desc Edit a post
// ?@access Private

router.put('/:id', auth, posts.update);

// ?@route DELETE api/post
// ?@desc Delete a post
// ?@access Private

router.delete('/:id', auth, posts.delete);

module.exports = router;
