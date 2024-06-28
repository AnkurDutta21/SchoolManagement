const express = require("express");
const { login, register, logout } = require("../controller/auth");
const authHandler = require("../middleware/authHandler");
const router = express.Router();

router.post("/login", login);

router.post("/register", register);
router.post('/logout',authHandler,logout)

module.exports = router;
