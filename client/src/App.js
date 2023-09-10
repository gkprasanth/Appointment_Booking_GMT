import React, { useState } from "react";
import CalendarComponent from "./Components/Calendar";
import BookingModal from "./Components/BookingModal";
import "./App.css";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const bookAppointment = () => {
    if (selectedDate && selectedTimeSlot) {
      // Create a new appointment object
      const newAppointment = {
        date: selectedDate.toDateString(),
        timeSlot: selectedTimeSlot,
      };


      setAppointments([...appointments, newAppointment]);


      setIsBookingModalOpen(false);

      setSelectedTimeSlot(null);
    }
  };


  const closeModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
  };


  const tileContent = ({ date }) => {
    const appointmentsOnDate = appointments.filter(
      (appointment) => appointment.date === date.toDateString()
    );

  
    if (appointmentsOnDate.length > 0) {
      return <p>{appointmentsOnDate.length} Appointments</p>;
    }

    return null; 
  };

  return (
    <div>
    
      <CalendarComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        tileContent={tileContent}
        setSelectedTimeSlot={setSelectedTimeSlot}
        setIsBookingModalOpen={setIsBookingModalOpen}
      />
      <BookingModal
        isOpen={isBookingModalOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        bookAppointment={bookAppointment}
      />
      <div className="appointment-list">
        <h2>Appointments:</h2>
        <ul>
          {appointments.map((appointment, index) => (
            <li key={index}>
              {appointment.date} - {appointment.timeSlot}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
