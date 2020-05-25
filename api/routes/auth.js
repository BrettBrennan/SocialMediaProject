const express = require('express');
const db = require('../models');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Users = db.users;

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		const { id } = req.user;
		const user = await Users.findOne({
			attributes: [
				'id',
				'name',
				'email',
				'profile_pic',
				'website',
				'bio',
				'createdAt',
				'updatedAt',
			],
			where: { id: id },
		});
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await Users.findOne({ where: { email: email } });

			if (!user) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
