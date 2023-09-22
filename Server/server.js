const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const { sequelize, Appointments } = require('./database');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 4000;

// Google Calendar API setup
const key = require('./calendarapisource.json');
const auth = new google.auth.JWT({
  email: process.env.client_email,
  key: process.env.private_key_id,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar('v3');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.M_PASSWORD,
  }
});

// Function to fetch events from Google Calendar
const getGoogleCalendarEvents = async () => {
  try {
    const response = await calendar.events.list({
      auth,
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching events from Google Calendar:', error);
    throw error;
  }
};

// Route to get Google Calendar events
app.get('/api/google-calendar-events', async (req, res) => {
  try {
    const events = await getGoogleCalendarEvents();
    res.json({ events });
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch Google Calendar events' });
  }
});

// Route to get available time slots for a selected date
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

// Route to book an appointment
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

    // Call function to create Google Calendar event
    await createGoogleCalendarEvent(formattedDate, timeSlot, userName, userEmail);

    // Send confirmation email
    sendEmail(userEmail, formattedDate, timeSlot, userName);

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Function to create a Google Calendar event
const createGoogleCalendarEvent = async (formattedDate, selectedTimeSlot, userName, userEmail) => {
  try {
    const event = {
      summary: 'Consultation with ' + userName,
      description: 'Appointment booked by ' + userName,
      start: {
        dateTime: `${formattedDate}T${selectedTimeSlot}`,
        timeZone: 'UTC',
      },
      end: {
        dateTime: `${formattedDate}T${selectedTimeSlot}`,
        timeZone: 'UTC',
      },
      attendees: [{ email: userEmail }],
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

// Function to send confirmation email
const sendEmail = (userEmail, formattedDate, selectedTimeSlot, userName) => {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: userEmail,
    subject: 'Appointment Confirmation',
    text: `Hi ${userName},\n\nYour appointment for ${formattedDate} at ${selectedTimeSlot} has been booked successfully.\n\nBest regards,\nThe Appointment Team\nLokesh Medharametla`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
