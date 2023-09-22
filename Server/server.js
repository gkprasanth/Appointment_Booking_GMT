const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const { sequelize, Appointments } = require('./database');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 4000;

const key = require('./calendarapisource.json');
const auth = new google.auth.JWT({
  email: process.env.client_email,
  key: process.env.private_key_id,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar('v3');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.M_PASSWORD,
  }
});

const createGoogleCalendarEvent = async (selectedTimeSlot, name, email) => {
  try {
    const event = {
      summary: 'Consultation with ' + name,
      description: 'Appointment booked by ' + name,
      start: {
        dateTime: selectedTimeSlot,
        timeZone: 'UTC',
      },
      end: {
        dateTime: selectedTimeSlot,
        timeZone: 'UTC',
      },
      attendees: [{ email }],
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: event,
    });

    console.log('Event created:', response.data.htmlLink);
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
};

const sendEmail = (userEmail, formattedDate, selectedTimeSlot, userName) => {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: userEmail,
    subject: 'Appointment Confirmation',
    text: `Hi ${userName},\n\nYour appointment for ${formattedDate} at ${selectedTimeSlot} has been booked successfully.\nBest regards,\nThe Appointment Team\nLokesh Medharametla`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

app.get('/api/available-time-slots', async (req, res) => {
  try {
    const { selectedDate } = req.query;

    if (!selectedDate) {
      return res.status(400).json({ error: 'Selected date is missing' });
    }

    const availableTimeSlots = await Appointments.findAll({
      where: {
        date: selectedDate,
        isBooked: true,
      },
    });

    const bookedTimeSlots = availableTimeSlots.map((slot) => slot.timeSlot);
    const allTimeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    ];
    const remainingTimeSlots = allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot));

    res.json({ availableTimeSlots: remainingTimeSlots });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
});

app.post('/api/book-appointment', async (req, res) => {
  try {
    const { date, timeSlot, userEmail, userName } = req.body;
    if (!date || !timeSlot || !userEmail || !userName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await Appointments.create({
      date,
      timeSlot,
      isBooked: true,
    });

    const formattedDate = new Date(date).toLocaleDateString();
    sendEmail(userEmail, formattedDate, timeSlot, userName);

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

const consultants = [];

app.get('/api/consultants', (req, res) => {
  res.json(consultants);
});

app.post('/api/consultants', (req, res) => {
  const newConsultant = req.body;
  consultants.push(newConsultant);
  res.status(201).json(newConsultant);
});



// --------------------------DEPLOYMENT------------------------
// Serve static assets if in production
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname1, '..', 'client', 'build'); // Adjust the path as needed
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API RUNNING SUCCESSFULLY');
  });
}



sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
