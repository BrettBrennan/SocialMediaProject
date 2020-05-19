const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sections = db.sections;
const config = require("config");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// Create and Save a new Section
exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, desc } = req.body;

        let secFind = await Sections.findOne({ where: { title: title } });

        if (secFind) {
            return res.status(400).json({ msg: "Section already exists" });
        }

        const section = {
            creator: req.user.id,
            title: title,
            description: desc,
        };

        Sections.create(section);

        // TODO: Add a return link for newly created section!
        res.status(200).json(section);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

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
