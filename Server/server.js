const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const { sequelize, Appointments } = require('./database'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json("Server Running Successfully");
});

// const key = require('./path-to-your-credentials.json'); /
// const auth = new google.auth.JWT({
//   email: key.client_email,
//   key: key.private_key,
//   scopes: ['https://www.googleapis.com/auth/calendar'],
// });
// const calendar = google.calendar('v3');

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

app.get('/api/available-time-slots', async (req, res) => {
  try {
    const { selectedDate } = req.query;
    if (!selectedDate) {
      return res.status(400).json({ error: 'Selected date is missing' });
    }

    const availableTimeSlots = await Appointments.findAll({
      attributes: ['timeSlot'],
      where: {
        date: selectedDate,
        isBooked: false,
      },
    });

    const bookedTimeSlots = availableTimeSlots.map((slot) => slot.timeSlot);
    const allTimeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
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
    const { date, timeSlot, userEmail } = req.body;
    if (!date || !timeSlot || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [updatedRowsCount] = await Appointments.update(
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
      createGoogleCalendarEvent(date + 'T' + timeSlot, 'Consultation', userEmail);

      res.status(200).json({ message: 'Appointment booked successfully' });
    } else {
      res.status(400).json({ error: 'Failed to book appointment' });
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
