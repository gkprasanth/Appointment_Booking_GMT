# Appointment Booking Web Application

This web application allows users to schedule appointments with consultants. It provides user-facing features for booking appointments and consultant-facing features for managing availability. The application is built using the following technology stack:

## Technology Stack

### Frontend
- HTML
- CSS
- React

### Backend
- Node.js
  
### Database
- MySQL

## User-Facing Features

### Calendar View

- Users can view a calendar that displays all days of the month with available time slots for appointments. The calendar provides an easy-to-understand view of the entire month.

### Booking

- Users can select an available time slot and book an appointment with a consultant.

### Confirmation Email

- Upon booking confirmation, the application sends an email to the user confirming the appointment details.

### Google Calendar Integration

- An event is automatically created in the consultant's Google Calendar upon successful booking, and the user is added as a guest to the event to receive event notifications.

## Consultant-Facing Features

### Availability Management

- Consultants have an interface to set their availability, including defining working hours, breaks, and days off.


## Getting Started

To run this web application on your local machine, follow these steps:

1. Clone the repository to your local machine.

2. Install the necessary dependencies for both frontend and backend.

- cd gmtTask
- client
- npm install
- cd ../server
- npm install


3. Configure the MySQL database:
- Create a MySQL database and import the schema provided in the `database_schema.sql` file.

4. Set up environment variables:
- Create a `.env` file in the `backend` directory and configure it with your database connection details, Google Calendar API credentials, and email service credentials.

5. Start the backend server: with cmd ### npm start

6. Start the frontend: with cmd ### npm start


7. Access the web application in your browser at `http://localhost:3000`.

## Thank You




