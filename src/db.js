const Database = require("./database");

let dbInstance = new Database("users")

module.exports = () => {
  return dbInstance;
};
