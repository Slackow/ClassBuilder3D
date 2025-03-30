// src/Chat.jsx

import React, { useState } from 'react'; 
import Duck3DChat from './Duck3Dchat'; 
import './Chat.css'; 

// --- Define Majors List ---
// --- ADD OR REMOVE MAJORS HERE ---
const majorsList = [
  "Computer Science",
  "Quantitative Finance",
  "Cybersecurity",
  "Software Engineering",
  "Information Systems",
  "Physics",
  "Chemical Biology",
  "Computational Science",
  "Pure & Applied Mathematics",
  "Business & Technology",
  "Engineering Management",
  "Financial Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Environmental Engineering",
  "Chemical Engineering",
  "Electrical Engineering",
  "Computer Engineering",
  "Biomedical Engineering",
  "Naval Engineering",
  // Add more Stevens majors as needed
];
// --- END MAJORS LIST ---


function Chat() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(""); 

  const handleDuckButtonClick = () => {
    console.log("Duck button clicked!");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMajorChange = (event) => {
    setSelectedMajor(event.target.value);
  };

  return (
    <div className={`chat-page-wrapper ${isMenuOpen ? 'menu-is-open' : ''}`}> 
      <div className="chat-fullscreen-container"> 
        <h1>This is the Chat page.</h1>
        {/* Chat interface elements would go here */}
      </div>

      {/* --- Select Major Button --- */}
      {/* This button will be covered by the menu when open */}
      <button className="select-major-button" onClick={toggleMenu}>
        Select Major
      </button>

      {/* --- Backdrop Blur Overlay --- */}
      <div 
        className={`menu-backdrop-blur ${isMenuOpen ? 'open' : ''}`}
        onClick={toggleMenu} 
      ></div>

      {/* --- Major Selection Menu --- */}
      <div className={`major-menu ${isMenuOpen ? 'open' : ''}`}>
        
        {/* --- ADD CLOSE BUTTON HERE --- */}
        <button 
          className="menu-close-button" 
          onClick={toggleMenu} 
          aria-label="Close menu"
        >
          × {/* HTML entity for multiplication sign (X) */}
        </button>
        {/* --- END CLOSE BUTTON --- */}

        <h2>Choose Your Major</h2>
        <p>Currently selected: {selectedMajor || "None"}</p> 

        <select 
          className="major-select-dropdown" 
          value={selectedMajor} 
          onChange={handleMajorChange}
        >
          <option value="" disabled>--- Select a Major ---</option>
          {majorsList.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
      </div>

      {/* --- Duck Button --- */}
      <button 
        className="chat-duck-button" 
        onClick={handleDuckButtonClick} 
        aria-label="Duck Assistant"
      >
        <Duck3DChat /> 
      </button>
    </div>
  );
}

export default Chat;