import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ConsultantList() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/consultants')
      .then((response) => {
        setConsultants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching consultants:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="consultant-list">
      <h2>Consultants</h2>
      {loading ? (
        <p>Loading consultants...</p>
      ) : (
        <ul>
          {consultants.map((consultant) => (
            <li key={consultant.id}>
              <h3>{consultant.name}</h3>
              <p>Working Hours: {consultant.workingHours}</p>
              <p>Breaks: {consultant.breaks}</p>
              <p>Days Off: {consultant.daysOff}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ConsultantList;
