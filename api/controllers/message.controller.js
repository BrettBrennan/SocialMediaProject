const db = require('../models');
const Messages = db.messages;
const Users = db.users;
const { validationResult } = require('express-validator');
//* Create and Save a new Message
exports.create = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		if (
			req.body.id === null ||
			req.body.id === '' ||
			req.user === null ||
			req.user.id === ''
		)
			return res
				.status(400)
				.json({ msg: 'User cannot be null or empty.' });
		let userFind = await Users.findOne({
			where: { id: req.body.receiver },
		});

		if (userFind) {
			const message = {
				sender: req.user.id,
				receiver: req.body.receiver,
				message: req.body.message,
			};
			const createdMessage = await Messages.create(message);
			return res.status(200).json(createdMessage);
		} else {
			return res.status(400).json({ msg: "User doesn't exist" });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
exports.getUnreadMessages = async (req, res) => {
	try {
		if (req.params.id === null || req.params.id === '')
			return res
				.status(400)
				.json({ msg: 'User cannot be null or empty.' });

		let query = await Messages.findAll({
			order: [['createdAt', 'DESC']],
			where: {
				receiver: req.params.id,
				read: false,
			},
		});
		if (query) return res.status(200).json(query);
		return res.status(400).json({ msg: "Messages couldn't be retrieved." });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
exports.getMessages = async (req, res) => {
	try {
		if (
			req.params.id === null ||
			req.params.id === '' ||
			req.user === null ||
			req.user.id === ''
		)
			return res
				.status(400)
				.json({ msg: 'User cannot be null or empty.' });

		let query = await Messages.findAll({
			order: [['createdAt', 'DESC']],
			where: {
				sender: req.user.id,
				receiver: req.params.id,
			},
			limit: 15,
		});
		if (query) return res.status(200).json(query);
		return res.status(400).json({ msg: "Messages couldn't be retrieved." });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

//* Delete a Message with the specified id in the request
exports.delete = async (req, res) => {
	try {
		// TODO: Allow user to delete message ?
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
