const config = require("./config");
const express = require("express");
const app = express();
const port = config.PORT;
const cookieParser = require("cookie-parser");
const User = require("./models/User")
const permissionVerify = require("./routes/permissionVerify");
const {isAdmin} = require("./routes/activityRouter"); //added the isAdmin function

// Middleware par aanalisar o corpo das requisições JSON
app.use(express.json());

// Middleware para lidar com cookies
app.use(cookieParser());

// login page
const loginPage = require("./pages/login");
app.get("/", loginPage);

// create page
const createPage = require("./pages/create");
app.get("/create", (req, res) => {
	res.send(createPage());
});

// app page
const appPage = require("./pages/app");
app.get("/app", permissionVerify, appPage); //added the permissionVerify

//create activity page
const {createActivityPage} = require('./pages/createActivity'); //added {}
app.get('/createActivity', permissionVerify, async (req, res) => { //removed the isAdmin function
    if(!await isAdmin(req.user.id)){
        return res.redirect('/app') // changed to /app
    }
    res.send(createActivityPage());
});

// rotas
const routes = require("./routes");
app.use("/", routes); //changed to '/'

//404 page
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
  });

const initUsers = async () => {
	console.log("init users");
	await User.createAdminIfNotExists(); // Chamada correta da função
};

app.listen(port, async () => {
	await initUsers()
	console.log(`Servidor rodando na porta ${port}`);
});
