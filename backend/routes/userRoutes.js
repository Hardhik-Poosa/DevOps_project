const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../controllers/userController");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", createUser);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);

module.exports = router;
