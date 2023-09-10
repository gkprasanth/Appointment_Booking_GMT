const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes , Appointments} = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const sequelize = new Sequelize({
  database: process.env.MYSQLDATABASE,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: 'mysql',
});


sequelize.sync().then(() => {
  console.log('Database and tables are synced.');
});


app.get('/api/available-time-slots', async (req, res) => {
  try {
    const { selectedDate } = req.query;
    const availableTimeSlots = await Appointment.findAll({
      attributes: ['timeSlot'],
      where: {
        date: selectedDate,
        isBooked: false,
      },
    });
    const bookedTimeSlots = availableTimeSlots.map((slot) => slot.timeSlot);
    const allTimeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'
    ];
    const remainingTimeSlots = allTimeSlots.filter(
      (slot) => !bookedTimeSlots.includes(slot)
    );
    res.json({ availableTimeSlots: remainingTimeSlots });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
});

app.post('/api/book-appointment', async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    const [updatedRowsCount] = await Appointment.update(
      { isBooked: true },
      {
        where: {
          date,
          timeSlot,
          isBooked: false,
        },
      }
    );
    if (updatedRowsCount === 1) {
      res.status(200).json({ message: 'Appointment booked successfully' });
    } else {
      res.status(400).json({ error: 'Failed to book appointment' });
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
