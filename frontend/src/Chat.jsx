// src/Chat.jsx

import React, { useState, useMemo, useCallback } from 'react';
import Duck3DChat from './Duck3Dchat'; 
import './Chat.css'; 

// --- Define Majors List ---
const majorsList = [
  "Computer Science",
  "Cybersecurity",
];

// --- Define Courses by Major ---
const coursesByMajor = {
  "Computer Science": [
    "CS 115 - Introduction to Computer Science", "CS 135 - Discrete Structures", "CS 146 - Introduction to Web Programming", "CS 284 - Data Structures", "CS 385 - Algorithms", "CS 392 - Systems Programming", "CS 396 - Security, Privacy & Society", "CS 442 - Database Management Systems", "CS 496 - Programming Languages", "CS 511 - Concurrent Programming", "CS 546 - Web Programming I", "CS 554 - Web Programming II", "MA 222 - Probability and Statistics", "MA 123 - Calculus I", "MA 124 - Calculus II",
  ],
  "Cybersecurity": [
    "CS 115 - Introduction to Computer Science", "CS 135 - Discrete Structures", "CS 284 - Data Structures", "MA 123 - Calculus I", "MA 222 - Probability and Statistics", "CS 392 - Systems Programming", "CS 306 - Introduction to IT Security", "CS 370 - Introduction to Operating Systems", "CS 488 - Computer Architecture", "CS 492 - Operating Systems Security", "CS 494 - Network and Internet Security", "CS 573 - Fundamentals of CyberSecurity", "CS 576 - Systems Security", "CS 577 - Reverse Engineering and Application Analysis", "CS 578 - Privacy in a Networked World", "CS 579 - Foundations of Cryptography", "CS 588 - Network Management and Security", "CS 519 - Introduction to E-Commerce Security", "CS 549 - Introduction to Computer Networks", "CS 571 - Cybersecurity Ethics",
  ],
};
// --- END COURSE DATA ---


function Chat() {
  // State for Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(""); 

  // --- State for Tag Input 1 (Courses Taken) ---
  const [takenInputValue, setTakenInputValue] = useState(""); 
  const [takenTags, setTakenTags] = useState([]); 
  const [isTakenSuggestionsOpen, setIsTakenSuggestionsOpen] = useState(false);

  // --- State for Tag Input 2 (Courses Desired) ---
  const [desiredInputValue, setDesiredInputValue] = useState(""); 
  const [desiredTags, setDesiredTags] = useState([]); 
  const [isDesiredSuggestionsOpen, setIsDesiredSuggestionsOpen] = useState(false);


  const handleDuckButtonClick = () => {
    console.log("Duck button clicked!");
  };

  // --- Menu Logic ---
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMajorChange = (event) => {
    const newMajor = event.target.value;
    setSelectedMajor(newMajor);
    // Clear everything when major changes
    setTakenTags([]); 
    setDesiredTags([]);
    setTakenInputValue(""); 
    setDesiredInputValue("");
    setIsTakenSuggestionsOpen(false);
    setIsDesiredSuggestionsOpen(false);
  };

  // --- Shared Tag Input Logic ---
  const availableCourses = useMemo(() => {
    // Ensures we always have an array, even if major isn't found
    return coursesByMajor[selectedMajor] || []; 
  }, [selectedMajor]);

  // --- Logic for Courses Taken Input ---
  const filteredTakenSuggestions = useMemo(() => {
    if (!takenInputValue) return [];
    const lowerCaseInput = takenInputValue.toLowerCase();
    return availableCourses.filter(course => 
      course.toLowerCase().includes(lowerCaseInput) && 
      !takenTags.includes(course) && // Don't suggest already taken
      !desiredTags.includes(course) // Don't suggest already desired (optional)
    );
  }, [takenInputValue, availableCourses, takenTags, desiredTags]); // Added desiredTags dependency

  const handleTakenInputChange = (event) => {
    const value = event.target.value;
    setTakenInputValue(value);
    // Recalculate if suggestions should be open based on current input & filters
    const suggestions = availableCourses.filter(course => 
        value && // Only filter if there's input
        course.toLowerCase().includes(value.toLowerCase()) && 
        !takenTags.includes(course) &&
        !desiredTags.includes(course)
    );
    setIsTakenSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };

  const handleSelectTakenTag = useCallback((tag) => {
    if (!takenTags.includes(tag)) {
      setTakenTags(prevTags => [...prevTags, tag]);
      // Remove from desired if it was there (optional logic)
      // setDesiredTags(prevDesired => prevDesired.filter(d => d !== tag));
    }
    setTakenInputValue(""); 
    setIsTakenSuggestionsOpen(false); 
  }, [takenTags]); 

  const handleRemoveTakenTag = useCallback((tagToRemove) => {
    setTakenTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []); // No dependency needed if only using filter

  const handleTakenKeyDown = (event) => {
    if (event.key === 'Enter' && takenInputValue && filteredTakenSuggestions.length > 0) {
       handleSelectTakenTag(filteredTakenSuggestions[0]);
       event.preventDefault(); 
    } else if (event.key === 'Backspace' && !takenInputValue && takenTags.length > 0) {
        handleRemoveTakenTag(takenTags[takenTags.length - 1]);
    }
  };

   // --- Logic for Courses Desired Input ---
  const filteredDesiredSuggestions = useMemo(() => {
    if (!desiredInputValue) return [];
    const lowerCaseInput = desiredInputValue.toLowerCase();
    return availableCourses.filter(course => 
      course.toLowerCase().includes(lowerCaseInput) && 
      !desiredTags.includes(course) && // Don't suggest already desired
      !takenTags.includes(course)    // Don't suggest already taken
    );
  }, [desiredInputValue, availableCourses, desiredTags, takenTags]); // Added takenTags dependency

  const handleDesiredInputChange = (event) => {
    const value = event.target.value;
    setDesiredInputValue(value);
    // Recalculate if suggestions should be open
    const suggestions = availableCourses.filter(course => 
        value && // Only filter if there's input
        course.toLowerCase().includes(value.toLowerCase()) && 
        !desiredTags.includes(course) &&
        !takenTags.includes(course)
    );
    setIsDesiredSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };

  const handleSelectDesiredTag = useCallback((tag) => {
    if (!desiredTags.includes(tag)) {
      setDesiredTags(prevTags => [...prevTags, tag]);
      // Remove from taken if it was there (optional logic)
      // setTakenTags(prevTaken => prevTaken.filter(t => t !== tag));
    }
    setDesiredInputValue(""); 
    setIsDesiredSuggestionsOpen(false); 
  }, [desiredTags]); 

  const handleRemoveDesiredTag = useCallback((tagToRemove) => {
    setDesiredTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []); // No dependency needed

  const handleDesiredKeyDown = (event) => {
    if (event.key === 'Enter' && desiredInputValue && filteredDesiredSuggestions.length > 0) {
       handleSelectDesiredTag(filteredDesiredSuggestions[0]);
       event.preventDefault(); 
    } else if (event.key === 'Backspace' && !desiredInputValue && desiredTags.length > 0) {
        handleRemoveDesiredTag(desiredTags[desiredTags.length - 1]);
    }
  };


  return (
    // Wrapper controls blur state
    <div className={`chat-page-wrapper ${isMenuOpen ? 'menu-is-open' : ''}`}> 
      {/* Main container now uses flexbox */}
      <div className="chat-fullscreen-container"> 
        
        {/* Left Panel */}
        <div className="chat-left-panel">
          <h1>Scheduler Area</h1>
          {/* Your main scheduling display would go here */}
        </div>

        {/* Right Panel */}
        <div className="chat-right-panel">
          
          {/* --- Courses Taken Input Section --- */}
          <div className="tag-input-section">
            <h3>Courses Taken</h3>
            {!selectedMajor && (
              <p className="select-major-prompt">
                Please select a major first using the button above.
              </p>
            )}

            {selectedMajor && (
              <div className="tag-input-container">
                {/* Display Selected Taken Tags */}
                <div className="selected-tags-area">
                  {takenTags.map((tag) => (
                    <div key={tag} className="tag-chip">
                      <span>{tag}</span>
                      <button 
                        onClick={() => handleRemoveTakenTag(tag)} 
                        className="remove-tag-button"
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input Field for Taken Courses */}
                <div className="input-wrapper">
                  <input 
                    type="text"
                    className="tag-input-field"
                    value={takenInputValue}
                    onChange={handleTakenInputChange}
                    onKeyDown={handleTakenKeyDown} 
                    onFocus={() => setIsTakenSuggestionsOpen(takenInputValue.length > 0 && filteredTakenSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setIsTakenSuggestionsOpen(false), 150)} // Delay slightly to allow click
                    placeholder="Search courses taken..."
                    disabled={!selectedMajor}
                  />

                  {/* Suggestions Dropdown for Taken Courses */}
                  {isTakenSuggestionsOpen && filteredTakenSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredTakenSuggestions.slice(0, 7).map((suggestion) => ( 
                        <li 
                          key={suggestion} 
                          className="suggestion-item"
                          onMouseDown={() => handleSelectTakenTag(suggestion)} 
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div> 
          {/* --- End Courses Taken Input --- */}


          {/* --- Courses Desired Input Section --- */}
          {/* Add some margin between sections */}
          <div className="tag-input-section section-spacer"> 
            <h3>Courses Desired</h3>
             {/* Prompt only needed if no major selected */}
            {!selectedMajor && ( <div/> )}

            {selectedMajor && (
              <div className="tag-input-container">
                {/* Display Selected Desired Tags */}
                <div className="selected-tags-area">
                  {desiredTags.map((tag) => (
                    <div key={tag} className="tag-chip">
                      <span>{tag}</span>
                      <button 
                        onClick={() => handleRemoveDesiredTag(tag)} 
                        className="remove-tag-button"
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input Field for Desired Courses */}
                <div className="input-wrapper">
                  <input 
                    type="text"
                    className="tag-input-field"
                    value={desiredInputValue}
                    onChange={handleDesiredInputChange}
                    onKeyDown={handleDesiredKeyDown} 
                    onFocus={() => setIsDesiredSuggestionsOpen(desiredInputValue.length > 0 && filteredDesiredSuggestions.length > 0)}
                     onBlur={() => setTimeout(() => setIsDesiredSuggestionsOpen(false), 150)} // Delay slightly
                    placeholder="Search courses desired..."
                    disabled={!selectedMajor} 
                  />

                  {/* Suggestions Dropdown for Desired Courses */}
                  {isDesiredSuggestionsOpen && filteredDesiredSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredDesiredSuggestions.slice(0, 7).map((suggestion) => ( 
                        <li 
                          key={suggestion} 
                          className="suggestion-item"
                          onMouseDown={() => handleSelectDesiredTag(suggestion)} 
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div> 
          {/* --- End Courses Desired Input --- */}


        </div> 
         {/* --- End Right Panel --- */}
      </div> 
      {/* --- End Fullscreen Container --- */}

      {/* --- Menu Components (Keep as before) --- */}
      <button className="select-major-button" onClick={toggleMenu}>
        Select Major
      </button>
      <div 
        className={`menu-backdrop-blur ${isMenuOpen ? 'open' : ''}`}
        onClick={toggleMenu} 
      ></div>
      <div className={`major-menu ${isMenuOpen ? 'open' : ''}`}>
        <button 
          className="menu-close-button" 
          onClick={toggleMenu} 
          aria-label="Close menu"
        >
          × 
        </button>
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
    </div> // --- End Page Wrapper ---
  );
}

export default Chat;