const db = require("../db");
const hashPassword = require("../utils/hashPassword");
const loginController = require("./loginController");
require("dotenv").config();


// Função para obter todos os usuários
const getAllUsers = (req, res) => {
	db().readAllData((err, data) => {
		if (err) {
			return res.status(500).json({error: "Erro ao buscar usuários"});
		}
		res.json(data);
	});
};

// Função para criar um novo usuário
const createUser = async (req, res) => {
	const {username, email, password} = req.body;

	// Validação simples
	if (!username || !email || !password) {
		return res
			.status(400)
			.json({error: "O username e o email são obrigatórios"});
	}

	db().get(`user_${email}`, async (err, userData) => {
		if (userData) {
			return res.status(400).json({error: "Email já registrado"});
		}

		// Criando o novo usuário
		const hashedPassword = await hashPassword(password);
		const newUser = {
			username,
			email,
			password: hashedPassword,
			isAdmin: false
		};

		// Salva o novo usuário no banco de dados
		db().put(`user_${email}`, JSON.stringify(newUser), err => {
			if (err) {
				return res.status(500).json({error: "Erro ao criar usuário"});
			}

			req.body.email = email;
			req.body.password = password;
			loginController.autenticate(req, res);
		});
	});
};

// Função para atualizar um usuário
const updateUser = (req, res) => {
	const {username, email} = req.body;

	db().get(`user_${email}`, (err, value) => {
		if (err) {
			return res.status(404).json({error: "Usuário não encontrado"});
		}

		// Atualiza o usuário
		const updateUser = {...JSON.parse(value), username, email};

		db().put(`user_${email}`, JSON.stringify(updateUser), err => {
			if (err) {
				return res.status(500).json({error: "Erro ao atualizar usuário"});
			}
			res.json({message: `Usuário com email ${email} atualizado`});
		});
	});
};

// Função para excluir um usuário
const deleteUser = (req, res) => {
	if (!req.user || req.user.isAdmin !== true) {
		return res.status(403).json({error});
	}

	const {email} = req.body;

	db().del(`user_${email}`, err => {
		if (err) {
			return res.status(500).json({error: "Erro ao excluir usuário"});
		}
		res.json({message: `Usuário com email ${email} excluído`});
	});
};

//
//
//
// criação de 2 usuarios
// Função para criar usuários iniciais (admin e comum)
const createInitialUsers = async () => {
  const adminEmail = "fabiano@gmail.com";
  const commonEmail = "vitoria@gmail.com";

  // Senhas retiradas do .env
  const adminPassword = process.env.ADMIN_PASSWORD;
  const commonPassword = process.env.COMMON_PASSWORD;

  // Verifica se o admin já existe
  db().get(`user_${adminEmail}`, async (err, adminData) => {
    if (err || !adminData) {
      const hashedAdminPassword = await hashPassword(adminPassword);
      const adminUser = {
        username: "fabiano",
        email: adminEmail,
        password: hashedAdminPassword,
        isAdmin: true
      };
      db().put(`user_${adminEmail}`, JSON.stringify(adminUser), err => {
        if (err) {
          console.log("Erro ao criar usuário admin:", err);
        } else {
          console.log("Usuário admin criado com sucesso!");
        }
      });
    }
  });

  // Criação do usuário comum
  db().get(`user_${commonEmail}`, async (err, commonData) => {
    if (err || !commonData) {
      const hashedCommonPassword = await hashPassword(commonPassword);
      const commonUser = {
        username: "vitoria",
        email: commonEmail,
        password: hashedCommonPassword,
        isAdmin: false
      };
      db().put(`user_${commonEmail}`, JSON.stringify(commonUser), err => {
        if (err) {
          console.log("Erro ao criar usuário comum:", err);
        } else {
          console.log("Usuário comum criado com sucesso!");
        }
      });
    }
  });
};

module.exports = {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
	createInitialUsers
};
