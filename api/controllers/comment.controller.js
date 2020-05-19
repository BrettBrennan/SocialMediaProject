const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Comments = db.comments;
const config = require("config");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// Create and Save a new Comment
exports.create = async (req, res) => {};

// Retrieve all Comment from the database.
exports.findAll = async (req, res) => {};

// Find a single Comment with an id
exports.findOne = async (req, res) => {};

// Update a Comment by the id in the request
exports.update = async (req, res) => {};

// Delete a Comment with the specified id in the request
exports.delete = async (req, res) => {};

// Delete all Comment from the database.
exports.deleteAll = async (req, res) => {};
