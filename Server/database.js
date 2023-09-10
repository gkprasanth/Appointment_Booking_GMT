const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.MYSQLDATABASE, 
  username: process.env.MYSQLUSER, 
  password: process.env.MYSQLPASSWORD, 
  host: process.env.MYSQLHOST, 
  port: process.env.MYSQLPORT 
  
});

module.exports = sequelize;
