const { comparePassword } = require("../utils/functions"); //removed hashPassword
const User = require("../models/User");

const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");

const getLogin = async (req, res) => {
	const token = req.cookies.session_id;
	if (!token) {
		return res.status(401).json({ error: 'Token JWT ausente' });
	}
	const decoded = jwt.verify(token, SECRET_KEY);
	const user = User.findUserById(decoded.user.id);
	if (!user) {
		return res.status(401).json({ error: 'Usuário não encontrado' });
	}
	return res.json(user);
};

const autenticate = async (req, res) => {
	const loginUsers = User.findAll();

	const { email, password } = req.body; //change to email

	const error = "Usuário e/ou senha inválidos!";
	if (!email || !password) { //change to email
		res.cookie("session_id", "", { expires: new Date(0) });
		return res.status(400).json({ error });
	}

	// Procura a existência de um usuário e senha em loginUsers
	const foundUser = User.findUserByEmail(email); //change to email
	if (!foundUser) {
		res.cookie("session_id", "", { expires: new Date(0) });
		return res.status(400).json({ error });
	}

	// compara a sena fornecida com a senha criptografada
	const match = await comparePassword(password, foundUser.password);

	if (!match) {
		res.cookie("session_id", "", { expires: new Date(0) });
		return res.status(400).json({ error });
	}

	// Usuário encontrado!
	const user = {
		username: foundUser.username,
		id: foundUser.id, //adicionado o id
        isAdmin: foundUser.isAdmin
	};

	// Gerando token JWT com informações personalizadas e enviando como cookie session_id
	try {
		const sessionToken = await jwt.sign({ user }, SECRET_KEY);

		res.cookie("session_id", sessionToken, { maxAge: 900000, httpOnly: true });
		res.json({ success: true, id: user.id, username: foundUser.username, isAdmin: foundUser.isAdmin }); //returning the user id, username and isAdmin
	} catch (err) {
		res.status(500).json({ error: "Erro ao gerar token JWT" });
	}
};

module.exports = {
	getLogin,
	autenticate,
};
