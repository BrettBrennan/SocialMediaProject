const db = require("../models");
const Comments = db.comments;
const Posts = db.posts;
const { validationResult } = require("express-validator");

// Create and Save a new Comment
exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { msg, post } = req.body;

        //? Find the post and verify it exists.

        let postFind = await Posts.findOne({ where: { id: post } });

        if (postFind) {
            //TODO: Verify user can comment on this post.
            //? Publish comment to said post.

            const comment = {
                creator: req.user.id,
                post_id: post,
                msg: msg,
            };
            const createdComment = await Comments.create(comment);

            return res.status(200).json(createdComment);
        } else {
            return res.status(400).json({ msg: "Post doesn't exist" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Retrieve all Comment from the database.
exports.findAll = async (req, res) => {
    try {
        let commentFind = await Comments.findAll();

        if (!commentFind) {
            return res.status(404).json({ msg: "No comments" });
        }

        return res.status(200).send(commentFind);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Find a single Comment with an id
exports.findOne = async (req, res) => {
    try {
        let commentFind = await Comments.findOne({
            where: { id: req.params.id },
        });

        if (!commentFind) {
            return res.status(404).json({ msg: "Comment doesn't exist" });
        }

        return res.status(200).send(commentFind);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Update a Comment by the id in the request
exports.update = async (req, res) => {
    try {
        let commentFind = await Comments.findOne({
            where: { id: req.params.id },
        });

        if (!commentFind) {
            return res.status(404).json({ msg: "Comment doesn't exist" });
        }

        const { creator } = commentFind;
        if (creator === req.user.id) {
            const num = await Comments.update(req.body, {
                where: { id: req.params.id },
            });
            if (num == 1) {
                //Success!
                res.status(200).send("Comment Updated");
            } else {
                res.status(500).send("Server Error");
            }
        } else {
            res.status(400).send(
                "You do not have the permissions to edit this comment."
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Delete a Comment with the specified id in the request
exports.delete = async (req, res) => {
    try {
        let commentFind = await Comments.findOne({
            where: { id: req.params.id },
        });

        if (!commentFind) {
            return res.status(404).json({ msg: "Comment doesn't exist" });
        }
        const { creator } = commentFind;
        if (creator === req.user.id) {
            await Comments.destroy({
                where: { id: req.params.id, creator: creator },
            });
            res.status(200).send("Comment Deleted");
        } else {
            res.status(400).send(
                "You do not have the permissions to delete this comment."
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Delete all Comments from the database.
exports.deleteAll = async (req, res) => {};
