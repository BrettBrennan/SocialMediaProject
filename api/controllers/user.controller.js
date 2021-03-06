const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = db.users;
const config = require('config');
const { validationResult } = require('express-validator');
// Create and Save a new User
const userAttr = [
	'id',
	'name',
	'email',
	'profile_pic',
	'website',
	'bio',
	'friend_requests',
	'friends',
	'blocked',
	'Subscribed_Sections',
	'createdAt',
	'updatedAt',
];
exports.create = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { name, email, password } = req.body;

	try {
		let userFind = await Users.findOne({ where: { email: email } });

		if (userFind) {
			return res.status(400).json({ msg: 'User already exists' });
		}

		const user = {
			name: name,
			email: email,
			password: password,
		};

		const salt = await bcrypt.genSalt(10);

		user.password = await bcrypt.hash(password, salt);

		await Users.create(user);
		let newUser = await Users.findOne({ where: { email: user.email } });
		const payload = {
			user: {
				id: newUser.id,
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
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Retrieve all User from the database.
exports.findAll = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let userFind = await Users.findAll({
			attributes: userAttr,
		});

		if (userFind) {
			res.status(200).send(userFind);
		} else {
			return res.status(400).send('No users yet');
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Find a single User with an id
exports.findOne = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let userFind = await Users.findOne({
			attributes: userAttr,
			where: { id: req.params.id },
		});

		if (userFind) {
			res.status(200).json(userFind);
		} else {
			return res.status(400).send('No user exists with this id');
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Find a single User with an email
exports.findOneByEmail = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const { email } = req.body;
		let userFind = await Users.findOne({
			attributes: userAttr,
			where: { email: email },
		});

		if (userFind) {
			//res.status(200).send(userFind.id);
			console.log(userFind.name);
			res.status(200).json(userFind);
		} else {
			return res.status(400).send('No user exists with this email');
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
// Update a User by the id in the request
exports.update = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let query = await Users.update(
			{
				[req.body.type]: req.body.payload,
			},
			{
				where: { id: req.params.id },
			}
		);
		let newUser = await Users.findOne({
			attributes: userAttr,
			where: { id: req.params.id },
		});
		if (query) {
			res.status(200).json(newUser);
		} else {
			return res.status(400).send("Couldn't Update User");
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
	try {
		let userFind = await Users.findOne({
			attributes: userAttr,
			where: { email: email },
		});

		if (!userFind) {
			return res.status(404).json({ msg: "User doesn't exist" });
		}

		await Users.destroy({
			where: { id: req.params.id },
		});
		res.status(200).send('User Deleted');
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Delete all User from the database.
exports.deleteAll = (req, res) => {};
