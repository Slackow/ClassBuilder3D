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
  // State for Major Menu
  const [isMajorMenuOpen, setIsMajorMenuOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(""); 

  // State for Tag Input 1 (Courses Taken)
  const [takenInputValue, setTakenInputValue] = useState(""); 
  const [takenTags, setTakenTags] = useState([]); 
  const [isTakenSuggestionsOpen, setIsTakenSuggestionsOpen] = useState(false);

  // State for Tag Input 2 (Courses Desired)
  const [desiredInputValue, setDesiredInputValue] = useState(""); 
  const [desiredTags, setDesiredTags] = useState([]); 
  const [isDesiredSuggestionsOpen, setIsDesiredSuggestionsOpen] = useState(false);
  
  // --- State for Chat Menu ---
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  // --- Menu Logic ---
  const toggleMajorMenu = () => {
    setIsMajorMenuOpen(!isMajorMenuOpen);
    if (!isMajorMenuOpen) setIsChatMenuOpen(false); // Close chat menu if opening major menu
  };

  const toggleChatMenu = () => {
    setIsChatMenuOpen(!isChatMenuOpen);
     if (!isChatMenuOpen) setIsMajorMenuOpen(false); // Close major menu if opening chat menu
  };

  const handleMajorChange = (event) => {
    const newMajor = event.target.value;
    setSelectedMajor(newMajor);
    setTakenTags([]); 
    setDesiredTags([]);
    setTakenInputValue(""); 
    setDesiredInputValue("");
    setIsTakenSuggestionsOpen(false);
    setIsDesiredSuggestionsOpen(false);
    // Close major menu after selection
    // setIsMajorMenuOpen(false); 
  };

  // --- Tag Input Logic (Keep as before) ---
  const availableCourses = useMemo(() => coursesByMajor[selectedMajor] || [], [selectedMajor]);

  const filteredTakenSuggestions = useMemo(() => { /* ... keep logic ... */
    if (!takenInputValue) return [];
    const lowerCaseInput = takenInputValue.toLowerCase();
    return availableCourses.filter(course => course.toLowerCase().includes(lowerCaseInput) && !takenTags.includes(course) && !desiredTags.includes(course));
  }, [takenInputValue, availableCourses, takenTags, desiredTags]);

  const handleTakenInputChange = (event) => { /* ... keep logic ... */
    const value = event.target.value;
    setTakenInputValue(value);
    const suggestions = availableCourses.filter(course => value && course.toLowerCase().includes(value.toLowerCase()) && !takenTags.includes(course) && !desiredTags.includes(course));
    setIsTakenSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };

  const handleSelectTakenTag = useCallback((tag) => { /* ... keep logic ... */
    if (!takenTags.includes(tag)) setTakenTags(prevTags => [...prevTags, tag]);
    setTakenInputValue(""); setIsTakenSuggestionsOpen(false);
  }, [takenTags]); 

  const handleRemoveTakenTag = useCallback((tagToRemove) => { /* ... keep logic ... */
    setTakenTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []); 

  const handleTakenKeyDown = (event) => { /* ... keep logic ... */
    if (event.key === 'Enter' && takenInputValue && filteredTakenSuggestions.length > 0) { handleSelectTakenTag(filteredTakenSuggestions[0]); event.preventDefault(); }
    else if (event.key === 'Backspace' && !takenInputValue && takenTags.length > 0) { handleRemoveTakenTag(takenTags[takenTags.length - 1]); }
  };

  const filteredDesiredSuggestions = useMemo(() => { /* ... keep logic ... */
    if (!desiredInputValue) return [];
    const lowerCaseInput = desiredInputValue.toLowerCase();
    return availableCourses.filter(course => course.toLowerCase().includes(lowerCaseInput) && !desiredTags.includes(course) && !takenTags.includes(course));
  }, [desiredInputValue, availableCourses, desiredTags, takenTags]); 

  const handleDesiredInputChange = (event) => { /* ... keep logic ... */
    const value = event.target.value;
    setDesiredInputValue(value);
    const suggestions = availableCourses.filter(course => value && course.toLowerCase().includes(value.toLowerCase()) && !desiredTags.includes(course) && !takenTags.includes(course));
    setIsDesiredSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };

  const handleSelectDesiredTag = useCallback((tag) => { /* ... keep logic ... */
    if (!desiredTags.includes(tag)) setDesiredTags(prevTags => [...prevTags, tag]);
    setDesiredInputValue(""); setIsDesiredSuggestionsOpen(false);
  }, [desiredTags]); 

  const handleRemoveDesiredTag = useCallback((tagToRemove) => { /* ... keep logic ... */
    setDesiredTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []); 

  const handleDesiredKeyDown = (event) => { /* ... keep logic ... */
    if (event.key === 'Enter' && desiredInputValue && filteredDesiredSuggestions.length > 0) { handleSelectDesiredTag(filteredDesiredSuggestions[0]); event.preventDefault(); } 
    else if (event.key === 'Backspace' && !desiredInputValue && desiredTags.length > 0) { handleRemoveDesiredTag(desiredTags[desiredTags.length - 1]); }
  };


  return (
    // Apply blur if either menu is open
    <div className={`chat-page-wrapper ${isMajorMenuOpen || isChatMenuOpen ? 'menu-is-open' : ''}`}> 
      {/* Main container */}
      <div className="chat-fullscreen-container"> 
        <div className="chat-left-panel">
          <h1>Scheduler Area</h1>
        </div>
        <div className="chat-right-panel">
          {/* Courses Taken Input Section */}
          <div className="tag-input-section">
            <h3>Courses Taken</h3>
            {!selectedMajor && (<p className="select-major-prompt">Please select a major first...</p>)}
            {selectedMajor && (
              <div className="tag-input-container">
                <div className="selected-tags-area">
                  {takenTags.map((tag) => (
                    <div key={tag} className="tag-chip">
                      <span>{tag}</span>
                      <button onClick={() => handleRemoveTakenTag(tag)} className="remove-tag-button" aria-label={`Remove ${tag}`}>×</button>
                    </div>
                  ))}
                </div>
                <div className="input-wrapper">
                  <input type="text" className="tag-input-field" value={takenInputValue} onChange={handleTakenInputChange} onKeyDown={handleTakenKeyDown} onFocus={() => setIsTakenSuggestionsOpen(takenInputValue.length > 0 && filteredTakenSuggestions.length > 0)} onBlur={() => setTimeout(() => setIsTakenSuggestionsOpen(false), 150)} placeholder="Search courses taken..." disabled={!selectedMajor}/>
                  {isTakenSuggestionsOpen && filteredTakenSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredTakenSuggestions.slice(0, 7).map((suggestion) => (<li key={suggestion} className="suggestion-item" onMouseDown={() => handleSelectTakenTag(suggestion)}>{suggestion}</li>))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div> 
          {/* Courses Desired Input Section */}
          <div className="tag-input-section section-spacer"> 
            <h3>Courses Desired</h3>
             {!selectedMajor && (<div/>)}
            {selectedMajor && (
              <div className="tag-input-container">
                <div className="selected-tags-area">
                  {desiredTags.map((tag) => (
                    <div key={tag} className="tag-chip">
                      <span>{tag}</span>
                      <button onClick={() => handleRemoveDesiredTag(tag)} className="remove-tag-button" aria-label={`Remove ${tag}`}>×</button>
                    </div>
                  ))}
                </div>
                <div className="input-wrapper">
                  <input type="text" className="tag-input-field" value={desiredInputValue} onChange={handleDesiredInputChange} onKeyDown={handleDesiredKeyDown} onFocus={() => setIsDesiredSuggestionsOpen(desiredInputValue.length > 0 && filteredDesiredSuggestions.length > 0)} onBlur={() => setTimeout(() => setIsDesiredSuggestionsOpen(false), 150)} placeholder="Search courses desired..." disabled={!selectedMajor} />
                  {isDesiredSuggestionsOpen && filteredDesiredSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredDesiredSuggestions.slice(0, 7).map((suggestion) => ( <li key={suggestion} className="suggestion-item" onMouseDown={() => handleSelectDesiredTag(suggestion)} >{suggestion}</li>))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div> 
        </div> 
      </div> 

      {/* --- Menu & Overlay Components --- */}
      <button className="select-major-button" onClick={toggleMajorMenu}>
        Select Major
      </button>
      
      {/* Backdrop - show if *either* menu is open */}
      <div 
        className={`menu-backdrop-blur ${isMajorMenuOpen || isChatMenuOpen ? 'open' : ''}`}
        // Let backdrop only close the major menu for now, chat uses X
        onClick={isMajorMenuOpen ? toggleMajorMenu : undefined} 
      ></div>

      {/* Major Menu */}
      <div className={`major-menu ${isMajorMenuOpen ? 'open' : ''}`}>
        <button className="menu-close-button" onClick={toggleMajorMenu} aria-label="Close menu">×</button>
        <h2>Choose Your Major</h2>
        <p>Currently selected: {selectedMajor || "None"}</p> 
        <select className="major-select-dropdown" value={selectedMajor} onChange={handleMajorChange}>
          <option value="" disabled>--- Select a Major ---</option>
          {majorsList.map((major) => (<option key={major} value={major}>{major}</option>))}
        </select>
      </div>

      {/* --- Chat Menu --- */}
      <div className={`chat-menu ${isChatMenuOpen ? 'open' : ''}`}>
         <button 
           className="menu-close-button" // Reuse same style for close button
           onClick={toggleChatMenu} 
           aria-label="Close chat"
         >
           × 
         </button>
         <h2>Chat Assistant</h2>
         {/* Placeholder Chat Interface */}
         <div className="chat-interface-placeholder">
            <div className="chat-messages-area">
                {/* Messages would appear here */}
                <p style={{color: '#777', textAlign: 'center', marginTop: '40px'}}>(Chatbot interface placeholder)</p>
            </div>
            <div className="chat-input-area">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
            </div>
         </div>
      </div>
      {/* --- End Chat Menu --- */}

      {/* --- Duck Button --- */}
      <button 
        className="chat-duck-button" 
        // Make duck button toggle the CHAT menu now
        onClick={toggleChatMenu} 
        aria-label="Open Chat Assistant"
      >
        <Duck3DChat /> 
      </button>
    </div> // --- End Page Wrapper ---
  );
}

export default Chat;