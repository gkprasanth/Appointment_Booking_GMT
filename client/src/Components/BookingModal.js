import React from "react";

const BookingModal = ({ isOpen, closeModal, selectedDate, selectedTimeSlot, bookAppointment }) => {
  if (!isOpen) return null;

  return (
    <div className="booking-modal">
      <h2 className="modal-title">Book Appointment</h2>
      <p>Date: {selectedDate.toDateString()}</p>
      <p>Time Slot: {selectedTimeSlot}</p>
      <div className="modal-buttons">
        <button className="modal-button" onClick={bookAppointment}>Confirm Booking</button>
        <button className="modal-button cancel-button" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default BookingModal;
