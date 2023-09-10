const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.MYSQLDATABASE, // Your database name
  username: process.env.MYSQLUSER, // Your MySQL username
  password: process.env.MYSQLPASSWORD, // Your MySQL password
  host: process.env.MYSQLHOST, // Your MySQL host (change this if it's hosted elsewhere)
  port: process.env.MYSQLPORT // Your MySQL port
  
});

module.exports = sequelize;
