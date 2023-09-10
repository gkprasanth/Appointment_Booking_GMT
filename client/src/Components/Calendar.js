import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import axios from 'axios';
import {  isToday, isBefore } from 'date-fns';
import { useSpring, animated } from 'react-spring'; 
import '../App.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [today, setToday] = useState(new Date());

  const fadeProps = useSpring({ opacity: 1, from: { opacity: 0 } });
  const slideProps = useSpring({
    transform: 'translateX(0%)',
    from: { transform: 'translateX(-100%)' },
  });

  const generateAvailableTimeSlots = async (date) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/available-time-slots?selectedDate=${date.toISOString()}`);
      if (response.status === 200) {
        setAvailableTimeSlots(response.data.availableTimeSlots);
      } else {
        setError('Failed to fetch available time slots');
      }
    } catch (error) {
      setError('Error fetching available time slots');
      console.error('Error fetching available time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    generateAvailableTimeSlots(date);
  };

  useEffect(() => {
    setToday(new Date());
  }, []);

  const handleBooking = async (timeSlot) => {
    try {
      const response = await axios.post('/api/book-appointment', {
        date: selectedDate.toISOString(),
        timeSlot,
      });
      if (response.status === 200) {
        alert('Appointment booked successfully!');
      } else {
        setError('Failed to book appointment');
      }
    } catch (error) {
      setError('Error booking appointment');
      console.error('Error booking appointment:', error);
    }
  };

  const tileClassName = ({ date }) => {
    if (isToday(date)) {
      return 'today';
    }
    if (isBefore(date, today)) {
      return 'blocked';
    }
    return null;
  };

  return (
    <animated.div style={fadeProps} className="calendar-container">
      <h2 className="calendar-header">Schedule Your Appointments</h2>
      <animated.div style={slideProps} className="calendar">
        <Calendar
          value={selectedDate}
          onClickDay={handleDateSelection}
          calendarType="US"
          tileClassName={tileClassName}
        />

        {selectedDate && (
          <p className="selected-date">
            Selected Date: {selectedDate.toDateString()}
          </p>
        )}

        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          availableTimeSlots.length > 0 && (
            <div className="time-slots">
              <h3 className="time-slots-header">Available Time Slots</h3>
              <div className="time-slot-buttons">
                {availableTimeSlots.map((timeSlot, index) => (
                  <button
                    key={index}
                    className="time-slot-button"
                    onClick={() => handleBooking(timeSlot)}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </animated.div>
    </animated.div>
  );
};

export default CalendarView;
