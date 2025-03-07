// src/controllers/userController.js
const User = require('../models/User');
const loginController = require('./loginController')

const createUser = async (req, res) => {
  const { username, password, email } = req.body; //add email
  try {
    const newUser = await User.create(username, email, password); //add email
    // Call loginController.autenticate to log in the new user
    req.body.email = email //changed to email
    req.body.password = password
    loginController.autenticate(req, res)
  } catch (error) {
      if(error.message === "Email already exists"){ //change to email
          return res.status(400).json({ error: error.message });
      }
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const getAllUsers = (req, res) => {
  const users = User.findAll();
  res.json(users);
};
const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
    const user = User.findUserById(id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
};
const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    const user = User.findUserById(id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { username, password } = req.body;
    user.update(username, password);
    res.json(user);
};
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)
    User.delete(id)
    res.json({ message: 'User removed' });
};

module.exports = { createUser, getAllUsers, updateUser, deleteUser, getUserById };
