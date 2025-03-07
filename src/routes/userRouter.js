// src/routes/userRouter.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const permissionVerify = require("./permissionVerify");

// New user creation route - no permissionVerify here
router.post("/", userController.createUser);

// aplica o middlware permissionVeriy em all the other routes
router.use(permissionVerify);

// get all users, only for test pourposes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
