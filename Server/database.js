const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.MYSQLDATABASE,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: 'mysql',
});

const TimeSlot = sequelize.define('TimeSlot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Appointments = sequelize.define('Appointments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Consultant = sequelize.define('Consultant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  workingHours: {
    type: DataTypes.STRING,
  },
  breaks: {
    type: DataTypes.STRING,
  },
  daysOff: {
    type: DataTypes.STRING,
  },
});

module.exports = { sequelize, TimeSlot, Appointments, Consultant };
