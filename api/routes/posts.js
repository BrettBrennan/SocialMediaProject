const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const posts = require('../controllers/post.controller');
const auth = require('../middleware/auth');

// ?@route GET api/posts
// ?@desc Get a post
// ?@access Public or Private depending on poster's preference

router.get('/', posts.findAll);

router.get('/feed', auth, posts.findFeed);

// ?@route GET api/posts/section_id
// ?@desc Get a post by section ID
// ?@access Public or Private depending on poster's preference

router.get('/:id', posts.findAllBySec);

// ?@route POST api/posts
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

// ?@route DELETE api/posts
// ?@desc Delete all posts
// ?@access Private

router.delete('/:id', auth, posts.deleteAll);

module.exports = router;
