const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Posts = db.posts;
const config = require("config");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// Create and Save a new Post
exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, body } = req.body;

        // TODO: Add a return link for newly created section!
        res.status(200).json({
            Title: title,
            Body: body,
            Poster: req.user.id,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Retrieve all Post from the database.
exports.findAll = async (req, res) => {};

// Find a single Post with an id
exports.findOne = async (req, res) => {};

// TODO: Figure out of we want findOne, findAll or new find.
exports.find = async (req, res) => {};

// Update a Post by the id in the request
exports.update = async (req, res) => {};

// Delete a Post with the specified id in the request
exports.delete = async (req, res) => {};

// Delete all Post from the database.
exports.deleteAll = async (req, res) => {};
