const db = require("../models");
const Sections = db.sections;
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

        const createdSec = await Sections.create(section);

        // TODO: Add a return link for newly created section!
        res.status(200).json(createdSec);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Retrieve all Section from the database.
exports.findAll = async (req, res) => {
    try {
        let secFind = await Sections.findAll();

        if (!secFind) {
            return res.status(404).json({ msg: "No sections yet." });
        }

        return res.status(200).send(secFind);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Find a single Section with an id
exports.findOne = async (req, res) => {
    try {
        let secFind = await Sections.findOne({ where: { id: req.params.id } });

        if (!secFind) {
            return res.status(404).json({ msg: "Section doesn't exist" });
        }

        return res.status(200).send(secFind);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Update a Section by the id in the request
exports.update = async (req, res) => {
    try {
        let secFind = await Sections.findOne({ where: { id: req.params.id } });

        if (!secFind) {
            return res.status(404).json({ msg: "Section doesn't exist" });
        }

        const { creator } = secFind;
        if (creator === req.user.id) {
            const num = await Sections.update(req.body, {
                where: { id: req.params.id },
            });
            if (num == 1) {
                //Success!
                res.status(200).send("Section Updated");
            } else {
                res.status(500).send(num);
            }
        } else {
            res.status(400).send(
                "You do not have the permissions to edit this section."
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Delete a Section with the specified id in the request
exports.delete = async (req, res) => {
    try {
        let secFind = await Sections.findOne({ where: { id: req.params.id } });

        if (!secFind) {
            return res.status(404).json({ msg: "Section doesn't exist" });
        }

        /**/

        const { creator } = secFind;

        if (creator === req.user.id) {
            await Sections.destroy({
                where: { id: req.params.id },
            });
            res.status(200).send("Section Deleted");
        } else {
            res.status(400).send(
                "You do not have the permissions to delete this section."
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Delete all Section from the database.
exports.deleteAll = async (req, res) => {};
