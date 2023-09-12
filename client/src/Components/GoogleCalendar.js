import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const apiKey = '';
    const calendarId = 'f2bf9b037a024f75946f2524f21fe0fc6b1f8dc30f7098edf26490a880440f69@group.calendar.google.com ';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;

    axios.get(url)
      .then((response) => {
        setEvents(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching Google Calendar events:', error);
      });
  }, []);

  return (
    <div>
      <h2>Google Calendar Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.summary}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleCalendar;
