const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Posts = db.posts;
const config = require("config");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// Create and Save a new Post
exports.create = async (req, res) => {};

// Retrieve all Post from the database.
exports.findAll = async (req, res) => {};

// Find a single Post with an id
exports.findOne = async (req, res) => {};

// Update a Post by the id in the request
exports.update = async (req, res) => {};

// Delete a Post with the specified id in the request
exports.delete = async (req, res) => {};

// Delete all Post from the database.
exports.deleteAll = async (req, res) => {};
