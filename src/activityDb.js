const Database = require("./database");

let activityDb = new Database("activity")

module.exports = () => {
  return activityDb;
};
