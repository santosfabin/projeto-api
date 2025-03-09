const express = require("express");
const app = express();
const port = 3000; // ou de acordo com seu arquivo de config
const cookieParser = require("cookie-parser");
const permissionVerify = require("./routes/permissionVerify");

const {createInitialUsers} = require("./controllers/userController");

const db = require("./db")
// Chama a função para criar os usuários iniciais
db().onOpen(createInitialUsers)

// Middleware para analisar o corpo das requisições JSON
app.use(express.json());

// Middleware para lidar com cookies
app.use(cookieParser());

// Página de login
const loginPage = require("./pages/login");
app.get("/", loginPage);

const createPage = require("./pages/create");
app.get("/createUser", (req, res) => {
	res.send(createPage());
});

// Rotas de usuários
const routes = require("./routes");
app.use("/", routes);

app.use(permissionVerify);

// Página do app
const appPage = require("./pages/app");
app.get("/app", appPage);

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});


