const express = require("express");
const logout = express.Router();

logout.get("/", (req, res) => {
	res.cookie("session_id", "", {expires: new Date(0), httpOnly: true});
	res.redirect("/");
});

module.exports = logout;
