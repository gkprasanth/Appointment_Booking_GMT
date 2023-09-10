import React, { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const generateAvailableTimeSlots = (date) => {
    const mockTimeSlots = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "2:00 PM",
      "3:00 PM",
    ];
    setAvailableTimeSlots(mockTimeSlots);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    generateAvailableTimeSlots(date);
  };

  return (
    <div className="calendar-container">
      <h2>Schedule Your Appointments</h2>
      <div className="calendar">
        <Calendar
          value={selectedDate}
          onClickDay={handleDateSelection}
          calendarType="US"
        />

        {selectedDate && (
          <p className="selected-date">
            Selected Date: {selectedDate.toDateString()}
          </p>
        )}

        {availableTimeSlots.length > 0 && (
          <div className="time-slots">
            <h3>Available Time Slots</h3>
            <div className="time-slot-buttons">
              {availableTimeSlots.map((timeSlot, index) => (
                <button key={index} className="time-slot-button">
                  {timeSlot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
