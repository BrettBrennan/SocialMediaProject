const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sections = db.sections;
const config = require("config");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// Create and Save a new Section
exports.create = async (req, res) => {};

// Retrieve all Section from the database.
exports.findAll = async (req, res) => {};

// Find a single Section with an id
exports.findOne = async (req, res) => {};

// TODO: Figure out of we want findOne, findAll or new find.
exports.find = async (req, res) => {};

// Update a Section by the id in the request
exports.update = async (req, res) => {};

// Delete a Section with the specified id in the request
exports.delete = async (req, res) => {};

// Delete all Section from the database.
exports.deleteAll = async (req, res) => {};
