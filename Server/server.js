const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const { sequelize, Appointments } = require('./database');
const nodemailer = require('nodemailer'); // Added Nodemailer

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Define your Google Calendar authentication (auth) and calendar objects
// based on your credentials. Uncomment and configure as needed.
// const key = require('./path-to-your-credentials.json');
// const auth = new google.auth.JWT({
//   email: key.client_email,
//   key: key.private_key,
//   scopes: ['https://www.googleapis.com/auth/calendar'],
// });
// const calendar = google.calendar('v3');

// Function to create a Google Calendar event
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

    console.log('Event created: %s', response.data.htmlLink);
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
};

// API endpoint to fetch available time slots
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
    const { date, timeSlot, userEmail } = req.body;
    if (!date || !timeSlot || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await Appointments.create({
      date: date,
      timeSlot: timeSlot,
      isBooked: true,
    });

    console.log(result);

    // Create Google Calendar event
    // await createGoogleCalendarEvent(date + 'T' + timeSlot, 'Consultation', userEmail);

  
    const transporter = nodemailer.createTransport({
      host: 'your-smtp-host',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@example.com',
      to: userEmail, 
      subject: 'Appointment Confirmation',
      text: 'Your appointment has been booked successfully.', 
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    transporter.close();

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

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
