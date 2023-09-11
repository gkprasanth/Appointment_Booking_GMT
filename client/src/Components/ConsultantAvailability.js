import React, { useState } from 'react';
import axios from 'axios';

function ConsultantAvailability() {
  const [workingHours, setWorkingHours] = useState('');
  const [breaks, setBreaks] = useState('');
  const [daysOff, setDaysOff] = useState('');

  const handleSaveAvailability = () => {
    const availabilityData = {
      workingHours,
      breaks,
      daysOff,
    };

    axios
      .post('/api/consultants', availabilityData)
      .then((response) => {
        console.log('Consultant availability saved:', response.data);
      })
      .catch((error) => {
        console.error('Error saving consultant availability:', error);
      });
  };

  return (
    <div className="consultant-availability">
      <h2>Set Your Availability</h2>
      <div className="form-group">
        <label htmlFor="workingHours">Working Hours:</label>
        <input
          type="text"
          id="workingHours"
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="breaks">Breaks:</label>
        <input
          type="text"
          id="breaks"
          value={breaks}
          onChange={(e) => setBreaks(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="daysOff">Days Off:</label>
        <input
          type="text"
          id="daysOff"
          value={daysOff}
          onChange={(e) => setDaysOff(e.target.value)}
        />
      </div>
      <button onClick={handleSaveAvailability}>Save Availability</button>
    </div>
  );
}

export default ConsultantAvailability;
