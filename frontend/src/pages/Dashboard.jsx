import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patient, setPatient] = useState("");

  // Fetch existing sessions when the component mounts
  useEffect(() => {
    getSessions();
  }, []);

  const getSessions = () => {
    api
      .get("/api/appointments/")
      .then((res) => res.data)
      .then((data) => {
        setSessions(data);
        filterSessions(data); // Split into past and upcoming
      })
      .catch((err) => alert(err));
  };

  const filterSessions = (sessions) => {
    const currentDate = new Date(); // Get current date and time

    const past = sessions.filter((session) => {
      const sessionDate = new Date(`${session.date}T${session.time}`); // Combine date and time
      return sessionDate < currentDate; // Past sessions are before the current date and time
    });

    const upcoming = sessions.filter((session) => {
      const sessionDate = new Date(`${session.date}T${session.time}`); // Combine date and time
      return sessionDate >= currentDate; // Upcoming sessions are on or after the current date and time
    });

    setPastSessions(past);
    setUpcomingSessions(upcoming);
  };

  const createAppointment = (e) => {
    e.preventDefault();
    api
      .post("/api/appointments/", { date, time, patient })
      .then((res) => {
        if (res.status === 201) {
          alert("Appointment created!");
          getSessions(); // Update sessions after creation
        } else {
          alert("Failed to create appointment.");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <>
      <div className="dashboard-header-container">
        <h2>Dashboard</h2>
        <div className="dashboard-button-container">
          <a href="/chatbot">
            <button id="dashboard-chatbot-btn">Chatbot</button>
          </a>
          <a href="/logout">
            <button id="dashboard-profile-btn">Logout</button>
          </a>
        </div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="dashboard-appointment-section">
            <h4>Add New Appointment</h4>
            <form id="dashboard-appointment-form" onSubmit={createAppointment}>
              <label htmlFor="patient">Patient:</label>
              <input
                type="text"
                id="patient"
                name="patient"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                required
              />
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <label htmlFor="time">Time:</label>
              <input
                type="time"
                id="time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <button type="submit" id="dashboard-form-button">Add Appointment</button>
            </form>
          </div>
        </div>

        <div className="dashboard-content">
          <div id="dashboard-sessions-list" className="dashboard-sessions">
            <h3>Past and Upcoming Sessions</h3>
            <div className="dashboard-sessions-wrapper">
              <div id="dashboard-past-sessions" className="dashboard-session-list">
                <h4>Past Sessions</h4>
                {pastSessions.length > 0 ? (
                  pastSessions.map((session) => (
                    <div key={session.id} className="dashboard-session-item">
                      <p>{session.patient}</p>
                      <p>{session.date} at {session.time}</p>
                    </div>
                  ))
                ) : (
                  <p>No past sessions</p>
                )}
              </div>
              <div id="dashboard-upcoming-sessions" className="dashboard-session-list">
                <h4>Upcoming Sessions</h4>
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div key={session.id} className="dashboard-session-item">
                      <p>{session.patient}</p>
                      <p>{session.date} at {session.time}</p>
                    </div>
                  ))
                ) : (
                  <p>No upcoming sessions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
