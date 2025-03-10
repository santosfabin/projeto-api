const comparePassword = require("../utils/comparePassword");

const db = require("../db");
const activityDb = require("../activityDb");

const {SECRET_KEY} = require("../config");
const jwt = require("jsonwebtoken");

const getLogin = async (req, res) => {
	const user = req.user;
	return res.json(user);
};

const autenticate = async (req, res) => {
	const {email, password} = req.body;

	const error = "Usuário e/ou senha inválidos!";

	if (!email || !password) {
		res.cookie("session_id", "", {expires: new Date(0)});

		return res.status(400).json({error});
	}

	const dbInstance = db();

	//
	//
	//
	//

	// Obtém todos os dados do banco de dados
	dbInstance.readAllData((err, data) => {
		if (err) {
			return res.status(500).json({error: "Erro ao acessar o banco de dados"});
		}

		// Exibe o banco de dados inteiro
		console.log("Banco de dados dos usuarios:", data);
	});

	// Obtém todos os dados do banco de dados de atividade
	const activity = activityDb();

	activity.readAllData((err, data) => {
		if (err) {
			return res.status(500).json({error: "Erro ao acessar o banco de dados"});
		}

		// Exibe o banco de dados inteiro
		console.log("Banco de dados das atividades:", data);
	});
	//
	//
	//
	//
	//
	//
	//
	//
	//

	dbInstance.get(`user_${email}`, async (err, userData) => {
		if (err || !userData) {
			res.cookie("session_id", "", {expires: new Date(0)});
			return res.status(400).json({error: "Usuário não encontrado!"});
		}

		const user = JSON.parse(userData);
		const match = await comparePassword(password, user.password);

		if (!match) {
			res.cookie("session_id", "", {expires: new Date(0)});
			return res.status(400).json({error});
		}

		try {
			const userWithoutPassword = {
				email: user.email,
				username: user.username,
				isAdmin: user.isAdmin
			};

			// aq ele é passado informações q podem ser pegas no req.user
			const sessionToken = await jwt.sign(
				{user: userWithoutPassword},
				SECRET_KEY
			);

			res.cookie("session_id", sessionToken, {maxAge: 900000, httpOnly: true});
			res.json({success: true});
		} catch (err) {
			res.status(500).json({error: "Erro ao gerar token JWT"});
		}
	});
};

module.exports = {
	getLogin,
	autenticate
};
