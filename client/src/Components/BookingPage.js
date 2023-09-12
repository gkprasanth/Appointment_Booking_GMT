import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function BookingForm() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState(''); // Add a state variable for the name
  const [message, setMessage] = useState('');
  const history = useNavigate();

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
        userName, // Include the name in the POST request
      });

      setMessage(response.data.message);

      // After successful booking, navigate to a success page
      history('/add-consultant');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage('Failed to book appointment. Please try again later.');
    }
  };

  return (
    <div className="booking-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="calendar-container">
            <Calendar onChange={setSelectedDate} value={selectedDate} />
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
          <label>Your Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
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
