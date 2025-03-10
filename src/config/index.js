require("dotenv").config();

const config = {
  NODE_ENV: process.env.NODE_ENV, // Sem fallback
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY // Agora depende apenas do arquivo .env
};


module.exports = config;
