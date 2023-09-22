import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConsultantList = ( userName ) => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/consultants")
      .then((response) => {
        setConsultants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching consultants:", error);
        setLoading(false);
      });
  }, []);

  const Goto = () => {
    setTimeout(() => {
      navigate("/");
    });
  };

  return (
    <div className="consultant-list">
      <h2>Consultants</h2>
      {loading ? (
        <p>Loading consultants...</p>
      ) : (
        <div>
          <ul>
            {consultants.map((consultant) => (
              <li key={consultant.id}>
                <h3>{consultant.name || "Name not available"}</h3>
                <p>Working Hours: {consultant.workingHours}</p>
                <p>Breaks: {consultant.breaks}</p>
                <p>Days Off: {consultant.daysOff}</p>
              </li>
            ))}
          </ul>
          <button
            style={{
              width: "150px",
              height: "50px",
              background: "crimson",
              color: "whitesmoke",
            }}
            onClick= {Goto}
          >
            EXIT
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultantList;
