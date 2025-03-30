// src/ProfessorsPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfessorsPage.css';

const ProfessorsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="professors-fullscreen">
      <div className="professors-header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-arrow">←</span> Back to Scheduler
        </button>
        <h1>Stevens Institute of Technology Professors</h1>
      </div>
      
      <div className="professors-iframe-container">
        <iframe
          src="https://www.ratemyprofessors.com/search/professors/675"
          title="RateMyProfessors - Stevens Institute of Technology"
          className="professors-iframe"
        ></iframe>
      </div>
    </div>
  );
};

export default ProfessorsPage;