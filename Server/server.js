const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');

dotenv.config();
const app = express();

app.use(bodyParser.json());

const sequelize = new Sequelize({
  database: process.env.MYSQLDATABASE,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: 'mysql',
});

const YourModel = sequelize.define('YourModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

const query = async (sql) => {
  try {
    const [results] = await sequelize.query(sql);
    return results;
  } catch (error) {
    throw error;
  }
};


const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database and tables are synced.');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
};


syncDatabase();

app.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM your_table');
    res.json(results);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`App listening on http://localhost:${process.env.PORT}`)
);
