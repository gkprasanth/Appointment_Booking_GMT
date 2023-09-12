import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function ConsultantForm() {
  const [workingHours, setWorkingHours] = useState('');
  const [breaks, setBreaks] = useState('');
  const [daysOff, setDaysOff] = useState('');
  const [message, setMessage] = useState('');

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const consultantAvailability = {
      workingHours,
      breaks,
      daysOff,
    };

    axios
      .post('/api/consultants', consultantAvailability)
      .then((response) => {
        setMessage('Consultant availability set successfully.');
        setWorkingHours('');
        setBreaks('');
        setDaysOff('');
        history('/consultants');
      })
      .catch((error) => {
        console.error('Error setting consultant availability:', error);
        setMessage('Failed to set consultant availability. Please try again later.');
      });
  };

  return (
    <div className="consultant-form">
      <h2>Set Your Availability</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Working Hours:</label>
          <input
            type="text"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Breaks:</label>
          <input
            type="text"
            value={breaks}
            onChange={(e) => setBreaks(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Days Off:</label>
          <input
            type="text"
            value={daysOff}
            onChange={(e) => setDaysOff(e.target.value)}
          />
        </div>
        <button type="submit">Set Availability</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ConsultantForm;
