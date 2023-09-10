import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingPage = () => {
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    axios.get('/api/available-time-slots')
      .then((response) => {
        setAvailableSlots(response.data.availableTimeSlots);
      })
      .catch((error) => {
        console.error('Error fetching available slots:', error);
      });
  }, []);

  return (
    <div>
      <h1>Available Time Slots</h1>
      <ul>
        {availableSlots.map((slot) => (
          <li key={slot}>
            {slot}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingPage;
