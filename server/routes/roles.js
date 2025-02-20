const express = require('express');
const mongoose = require('mongoose');

const roles_router = express.Router();

const Role = mongoose.model("roles", mongoose.Schema(
    {
        user_id: { type: String, required: true },
        role: {type: String, required: true}
    }
)
);

roles_router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Role.findOne({user_id : id});
        res.status(200).json(role);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});


roles_router.post("/", async (req, res) => {
    try {
        const role = new Role(req.body);
        const saved = await role.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res.status(500).json({ message: "An error has occured", error: e });
    }
});

module.exports = roles_router;