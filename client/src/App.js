import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingForm from './Components/BookingPage';
import ConsultantForm from './Components/ConsultantForm';
import ConsultantList from './Components/ConsultantList';
import ConsultantAvailability from './Components/ConsultantAvailability';

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<BookingForm />} />
            <Route path="/book-appointment" element={<BookingForm />} />
            <Route path="/add-consultant" element={<ConsultantForm />} />
            <Route path="/consultants" element={<ConsultantList />} />
            <Route path="/consultants/:id/edit" element={<ConsultantAvailability />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
