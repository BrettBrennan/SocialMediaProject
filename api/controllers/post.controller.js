const db = require('../models');
const Sections = db.sections;
const Posts = db.posts;
const { validationResult } = require('express-validator');

// Create and Save a new Post
exports.create = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { title, body, section } = req.body;

		//? Find the section and verify it exists.

		let secFind = await Sections.findOne({ where: { id: section } });

		if (secFind) {
			//TODO: Verify user can post to this section.
			//? Publish post to said section.

			const post = {
				creator: req.user.id,
				title: title,
				body: body,
				section_id: section,
			};
			const createdPost = await Posts.create(post);

			// TODO: Add a return link for newly created section!
			return res.status(200).json(createdPost);
		} else {
			return res.status(400).json({ msg: "Section doesn't exist" });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Retrieve all Post from the database.
exports.findAll = async (req, res) => {
	try {
		let postFind = await Posts.findAll();

		if (!postFind) {
			return res.status(404).json({ msg: 'No posts.' });
		}

		return res.status(200).send(postFind);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
// Retrieve all Posts from a certain Section from the database.
exports.findAllBySec = async (req, res) => {
	try {
		const { id } = req.params.id;
		let postFind = await Posts.findAll({
			where: { section_id: req.params.id },
			limit: 10,
			order: [['createdAt', 'DESC']],
		});

		if (!postFind) {
			return res.status(404).json({ msg: 'No posts.' });
		}

		return res.status(200).send(postFind);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Find a single Post with an id
exports.findOne = async (req, res) => {
	try {
		let postFind = await Posts.findOne({ where: { id: req.params.id } });

		if (!postFind) {
			return res.status(404).json({ msg: "Post doesn't exist" });
		}

		return res.status(200).send(postFind);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Update a Post by the id in the request
exports.update = async (req, res) => {
	try {
		let postFind = await Posts.findOne({ where: { id: req.params.id } });

		if (!postFind) {
			return res.status(404).json({ msg: "Post doesn't exist" });
		}

		const { creator } = postFind;
		if (creator === req.user.id) {
			const num = await Posts.update(req.body, {
				where: { id: req.params.id },
			});
			if (num == 1) {
				//Success!
				res.status(200).send('Post Updated');
			} else {
				res.status(500).send('Server Error');
			}
		} else {
			res.status(400).send(
				'You do not have the permissions to edit this post.'
			);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Delete a Post with the specified id in the request
exports.delete = async (req, res) => {
	try {
		let postFind = await Posts.findOne({ where: { id: req.params.id } });

		if (!postFind) {
			return res.status(404).json({ msg: "Post doesn't exist" });
		}
		const { creator } = postFind;
		if (creator === req.user.id) {
			await Posts.destroy({
				where: { id: req.params.id, creator: creator },
			});
			res.status(200).send('Post Deleted');
		} else {
			res.status(400).send(
				'You do not have the permissions to delete this post.'
			);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Delete all Post from the database.
exports.deleteAll = async (req, res) => {};
