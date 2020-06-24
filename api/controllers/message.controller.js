const db = require('../models');
const Messages = db.messages;
const Users = db.users;
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const Op = Sequelize.Op;
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
exports.getConversations = async (req, res) => {
	try {
		if (!req.user || req.user.id == '')
			return res
				.status(400)
				.json({ msg: 'User cannot be null or empty.' });

		/*
		 * Get all user ids from datase.
		 * Compare all sender/receiver combos with all user ids retrieved and current user.
		 * Send back all matches as 'Conversations'
		 */
		const users = await Users.findAll({
			attributes: ['id', 'name', 'profile_pic'],
		});
		if (!users) return res.status(400).json({ msg: 'No users!' });
		let matched_users = [];
		for (let user in users) {
			let user_test = await Messages.findAndCountAll({
				where: {
					[Op.or]: [
						{ receiver: req.user.id, sender: users[user].id },
						{ receiver: users[user].id, sender: req.user.id },
					],
				},
				order: [['createdAt', 'DESC']],
				limit: 1,
			});
			if (user_test.count > 0) {
				matched_users = [
					...matched_users,
					{
						id: users[user].id,
						name: users[user].name,
						profile_pic: users[user].profile_pic,
						last_message: user_test.rows[0].message,
					},
				];
			}
		}

		return res.status(200).json(matched_users);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
exports.setMessagesAsRead = async (req, res) => {
	try {
		if (
			req.user === null ||
			req.user.id === '' ||
			req.params.id === null ||
			req.params.id === ''
		)
			return res
				.status(400)
				.json({ msg: 'User cannot be null or empty.' });

		let query = await Messages.update(
			{
				read: true,
			},
			{
				where: {
					receiver: req.user.id,
					sender: req.params.id,
				},
			}
		);
		if (query) return res.status(200).json(query);
		return res.status(400).json({ msg: "Messages couldn't be retrieved." });
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
				read: false || 0,
			},
		});
		if (query) return res.status(200).json(query);
		return res.status(400).json({ msg: "Messages couldn't be retrieved." });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
exports.getUserMessages = async (req, res) => {
	try {
		if (
			req.user === null ||
			req.user.id === '' ||
			req.params.id === null ||
			req.params.id === ''
		)
			return res
				.status(400)
				.json({ msg: 'User cannot be null or empty.' });

		let query = await Messages.findAll({
			order: [['createdAt', 'DESC']],
			where: {
				[Op.or]: [
					{ receiver: req.user.id, sender: req.params.id },
					{ receiver: req.params.id, sender: req.user.id },
				],
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
