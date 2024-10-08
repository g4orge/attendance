// src/HomePage.js
import React from 'react';
import './HomePage.css'; // Import CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Attendance Management System</h1>
        <p>Track and manage attendance effortlessly</p>
      </header>

      <section className="main-content">
        <div className="intro">
          <h2>Welcome to your dashboard</h2>
          <p>Manage employee/student attendance, view reports, and analyze trends all in one place.</p>
        </div>

        <div className="cta-buttons">
          <button className="btn-primary">Mark Attendance</button>
          <button className="btn-secondary">View Reports</button>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Attendance Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
