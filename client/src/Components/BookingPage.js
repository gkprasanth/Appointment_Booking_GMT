import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css'

function BookingForm() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      axios
        .get(`/api/available-time-slots?selectedDate=${formattedDate}`)
        .then((response) => {
          setAvailableTimeSlots(response.data.availableTimeSlots);
        })
        .catch((error) => {
          console.error('Error fetching available time slots:', error);
        });
    }
  }, [selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot || !userEmail) {
      setMessage('Please fill in all the required fields.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    axios
      .post('/api/book-appointment', {
        date: formattedDate,
        timeSlot: selectedTimeSlot,
        userEmail,
      })
      .then((response) => {
        setMessage(response.data.message);
        setSelectedDate(new Date());
        setSelectedTimeSlot('');
        setUserEmail('');
      })
      .catch((error) => {
        console.error('Error booking appointment:', error);
        setMessage('Failed to book appointment. Please try again later.');
      });
  };

  return (
    <div className="booking-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="calendar-container">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Select Time Slot:</label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <option value="">Select a time slot</option>
            {availableTimeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Your Email:</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default BookingForm;
