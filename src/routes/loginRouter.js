const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const {permissionVerify} = require("./permissionVerify");

router.post("/", loginController.autenticate);

router.use(permissionVerify)

router.get("/", loginController.getLogin);

module.exports = router;
