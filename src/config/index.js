require("dotenv").config();

const config = {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: process.env.PORT || 3000,
	SECRET_KEY: process.env.SECRET_KEY || "chave_aleatoria_qualquer"
};

module.exports = config;
