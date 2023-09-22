import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function BookingForm() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const history = useNavigate();

  const today = new Date();

  const tileClassName = ({ date }) => {
    if (date < today) {
      return 'disabled-date';
    }
    return null;
  };

  const handleDateClick = (date) => {
    if (date <= today) {
      alert('Selected date is finished and cannot be booked.');
    } else {
      setSelectedDate(date);
    }
  };

  const fetchAvailableTimeSlots = async (formattedDate) => {
    try {
      const response = await axios.get(`/api/available-time-slots?selectedDate=${formattedDate}`);
      setAvailableTimeSlots(response.data.availableTimeSlots);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
    }
  };

  const fetchGoogleCalendarEvents = async () => {
    try {
      const response = await axios.get('/api/google-calendar-events');
      console.log('Google Calendar events:', response.data.events);
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot || !userEmail || !userName) {
      setMessage('Please fill in all the required fields.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      const response = await axios.post('/api/book-appointment', {
        date: formattedDate,
        timeSlot: selectedTimeSlot,
        userEmail,
        userName,
      });

      setMessage(response.data.message);

      if (response.data.message === 'Appointment booked successfully') {
        alert('Appointment booked successfully');
      }

      history('/consultants/:id/edit');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage('Failed to book appointment. Please try again later.');
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      fetchAvailableTimeSlots(formattedDate);
      fetchGoogleCalendarEvents();  
    }
  }, [selectedDate]);

  return (
    <div className="booking-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="calendar">Select Date:</label>
          <div id="calendar" className="calendar-container">
            <Calendar
              onChange={handleDateClick}
              value={selectedDate}
              tileClassName={tileClassName}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="timeSlot">Select Time Slot:</label>
          <select
            id="timeSlot"
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
          <label htmlFor="userName">Your Name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="userEmail">Your Email:</label>
          <input
            type="email"
            id="userEmail"
            value={userEmail}
            required
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
