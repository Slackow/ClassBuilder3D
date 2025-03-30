// src/Chat.jsx

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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

// --- Base URL for API ---
// Make sure your backend server is running, likely on http://localhost:3000
// If deploying, change this to your deployed backend URL
const API_BASE_URL = 'http://localhost:3000'; // <--- Adjust if needed


function Chat() {
  // --- Existing State ---
  const [isMajorMenuOpen, setIsMajorMenuOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectContainerRef = useRef(null);
  const [takenInputValue, setTakenInputValue] = useState("");
  const [takenTags, setTakenTags] = useState([]);
  const [isTakenSuggestionsOpen, setIsTakenSuggestionsOpen] = useState(false);
  const [desiredInputValue, setDesiredInputValue] = useState("");
  const [desiredTags, setDesiredTags] = useState([]);
  const [isDesiredSuggestionsOpen, setIsDesiredSuggestionsOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  // --- NEW State for Chat ---
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I help you plan your schedule today? Please select your major first if you haven\'t.' }
  ]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const messagesEndRef = useRef(null); // Ref for scrolling

  // --- Existing useEffects ---
  useEffect(() => {
    if (isMajorMenuOpen || isChatMenuOpen) {
      document.body.classList.add('menu-open-no-scroll');
      document.documentElement.classList.add('menu-open-no-scroll');
    } else {
      document.body.classList.remove('menu-open-no-scroll');
      document.documentElement.classList.remove('menu-open-no-scroll');
    }
    return () => {
      document.body.classList.remove('menu-open-no-scroll');
      document.documentElement.classList.remove('menu-open-no-scroll');
    };
  }, [isMajorMenuOpen, isChatMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectContainerRef.current && !selectContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- NEW useEffect for Scrolling Chat ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scroll whenever messages change

  // --- Existing Menu Logic ---
  const toggleMajorMenu = () => {
    const opening = !isMajorMenuOpen;
    setIsMajorMenuOpen(opening);
    if (opening) setIsChatMenuOpen(false);
  };

  const toggleChatMenu = () => {
    const opening = !isChatMenuOpen;
    setIsChatMenuOpen(opening);
    if (opening) setIsMajorMenuOpen(false);
  };

  const handleBackdropClick = () => {
    if (isMajorMenuOpen) toggleMajorMenu();
    else if (isChatMenuOpen) toggleChatMenu();
  };

  const handleMajorChange = (event) => { // Keep this for fallback
    const newMajor = event.target.value;
    setSelectedMajor(newMajor);
    resetCourseInputs();
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleMajorSelect = (major) => {
    setSelectedMajor(major);
    setIsDropdownOpen(false);
    resetCourseInputs();
    // Optionally add a chat message confirming major selection
    setMessages(prev => [...prev, { sender: 'assistant', text: `Major set to ${major}. Now you can add courses taken/desired.` }]);
  };

  const resetCourseInputs = () => {
    setTakenTags([]);
    setDesiredTags([]);
    setTakenInputValue("");
    setDesiredInputValue("");
    setIsTakenSuggestionsOpen(false);
    setIsDesiredSuggestionsOpen(false);
  }

  // --- Existing Tag Input Logic (Unchanged) ---
  const availableCourses = useMemo(() => coursesByMajor[selectedMajor] || [], [selectedMajor]);

  const filteredTakenSuggestions = useMemo(() => {
    if (!takenInputValue) return [];
    const lowerCaseInput = takenInputValue.toLowerCase();
    return availableCourses.filter(course => course.toLowerCase().includes(lowerCaseInput) && !takenTags.includes(course) && !desiredTags.includes(course));
  }, [takenInputValue, availableCourses, takenTags, desiredTags]);

  const handleTakenInputChange = (event) => {
    const value = event.target.value;
    setTakenInputValue(value);
    const suggestions = availableCourses.filter(course => value && course.toLowerCase().includes(value.toLowerCase()) && !takenTags.includes(course) && !desiredTags.includes(course));
    setIsTakenSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };

  const handleSelectTakenTag = useCallback((tag) => {
    if (!takenTags.includes(tag)) setTakenTags(prevTags => [...prevTags, tag]);
    setTakenInputValue(""); setIsTakenSuggestionsOpen(false);
  }, [takenTags, desiredTags]);

  const handleRemoveTakenTag = useCallback((tagToRemove) => {
    setTakenTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []);

  const handleTakenKeyDown = (event) => {
    if (event.key === 'Enter' && takenInputValue && filteredTakenSuggestions.length > 0) { handleSelectTakenTag(filteredTakenSuggestions[0]); event.preventDefault(); }
    else if (event.key === 'Backspace' && !takenInputValue && takenTags.length > 0) { handleRemoveTakenTag(takenTags[takenTags.length - 1]); }
  };

  const filteredDesiredSuggestions = useMemo(() => {
    if (!desiredInputValue) return [];
    const lowerCaseInput = desiredInputValue.toLowerCase();
    return availableCourses.filter(course => course.toLowerCase().includes(lowerCaseInput) && !desiredTags.includes(course) && !takenTags.includes(course));
  }, [desiredInputValue, availableCourses, desiredTags, takenTags]);

  const handleDesiredInputChange = (event) => {
    const value = event.target.value;
    setDesiredInputValue(value);
    const suggestions = availableCourses.filter(course => value && course.toLowerCase().includes(value.toLowerCase()) && !desiredTags.includes(course) && !takenTags.includes(course));
    setIsDesiredSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };

  const handleSelectDesiredTag = useCallback((tag) => {
    if (!desiredTags.includes(tag)) setDesiredTags(prevTags => [...prevTags, tag]);
    setDesiredInputValue(""); setIsDesiredSuggestionsOpen(false);
  }, [desiredTags, takenTags]);

  const handleRemoveDesiredTag = useCallback((tagToRemove) => {
    setDesiredTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []);

  const handleDesiredKeyDown = (event) => {
    if (event.key === 'Enter' && desiredInputValue && filteredDesiredSuggestions.length > 0) { handleSelectDesiredTag(filteredDesiredSuggestions[0]); event.preventDefault(); }
    else if (event.key === 'Backspace' && !desiredInputValue && desiredTags.length > 0) { handleRemoveDesiredTag(desiredTags[desiredTags.length - 1]); }
  };

  // --- NEW Chat Functionality ---
  const handleChatInputChange = (event) => {
    setChatInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    const trimmedInput = chatInputValue.trim();
    if (!trimmedInput || isAssistantTyping) return; // Don't send empty or while typing

    // Check if major is selected
    if (!selectedMajor) {
        setMessages(prev => [...prev, { sender: 'assistant', text: 'Please select your major first using the button at the top right.' }]);
        return;
    }

    // Add user message to chat
    const newUserMessage = { sender: 'user', text: trimmedInput };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setChatInputValue(''); // Clear input field
    setIsAssistantTyping(true); // Show typing indicator

    // Prepare data for backend
    const requestData = {
      plan: takenTags, // Assuming 'plan' corresponds to courses taken
      school: selectedMajor, // Assuming 'school' corresponds to the major
      requests: trimmedInput  // The user's query
      // NOTE: Your backend uses studyPlans[school]. We send the major name.
      // Ensure your backend logic (studyPlans[school]) correctly uses the major name string.
      // Also, the backend doesn't seem to use 'desired courses' yet, but we have them in state (desiredTags).
    };

    try {
      const response = await fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.text(); // Get error text
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const assistantResponse = await response.text(); // Assuming backend sends plain text

      // Add assistant response to chat
      setMessages(prevMessages => [...prevMessages, { sender: 'assistant', text: assistantResponse }]);

    } catch (error) {
      console.error("Error fetching schedule:", error);
      // Add error message to chat
      setMessages(prevMessages => [...prevMessages, { sender: 'assistant', text: `Sorry, I encountered an error: ${error.message}` }]);
    } finally {
      setIsAssistantTyping(false); // Hide typing indicator
    }
  };

  // Handle Enter key press in chat input
  const handleChatKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Allow Shift+Enter for new lines if needed later
      event.preventDefault(); // Prevent default form submission/new line
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-page-wrapper ${isMajorMenuOpen || isChatMenuOpen ? 'menu-is-open' : ''}`}>
      {/* Main container */}
      <div className="chat-fullscreen-container">
        <div className="chat-left-panel">
          <h1>Scheduler Area</h1>
           {/* Display Generated Schedule Here (Example) */}
           {/* You might want a dedicated component or area to display the structured schedule */}
           {/* For now, it appears in the chat */}
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
        {selectedMajor ? `Major: ${selectedMajor}` : "Select Major"}
      </button>

      <div
        className={`menu-backdrop-blur ${isMajorMenuOpen || isChatMenuOpen ? 'open' : ''}`}
        onClick={handleBackdropClick}
      ></div>

      {/* Major Menu */}
      <div className={`major-menu ${isMajorMenuOpen ? 'open' : ''}`}>
        <button className="menu-close-button" onClick={toggleMajorMenu} aria-label="Close menu">×</button>
        <h2>Choose Your Major</h2>
        <p>Currently selected: {selectedMajor || "None"}</p>
        <div className="custom-select" ref={selectContainerRef}>
          <div
            className={`select-selected ${!selectedMajor ? 'placeholder' : ''} ${isDropdownOpen ? 'select-arrow-active' : ''}`}
            onClick={toggleDropdown}
          >
            {selectedMajor || "--- Select a Major ---"}
          </div>
          <div
            ref={dropdownRef}
            className={`select-items ${isDropdownOpen ? 'select-active' : 'select-hide'}`}
          >
            {majorsList.map((major) => (
              <div
                key={major}
                onClick={() => handleMajorSelect(major)}
                className={major === selectedMajor ? 'same-as-selected' : ''}
                style={{ textAlign: 'center', fontFamily: "'Courier New', monospace" }}
              >
                {major}
              </div>
            ))}
          </div>
        </div>
        <select
          className="major-select-dropdown"
          value={selectedMajor}
          onChange={handleMajorChange}
          style={{ display: 'none' }}
        >
          <option value="" disabled>--- Select a Major ---</option>
          {majorsList.map((major) => (<option key={major} value={major}>{major}</option>))}
        </select>
      </div>

      {/* --- Chat Menu (Now Functional) --- */}
      <div className={`chat-menu ${isChatMenuOpen ? 'open' : ''}`}>
         <button
           className="menu-close-button"
           onClick={toggleChatMenu}
           aria-label="Close chat"
         >
           ×
         </button>
         <h2>Chat Assistant</h2>
         <div className="chat-interface-placeholder">
            {/* MODIFIED: Render actual messages */}
            <div className="chat-messages-area">
                {messages.map((msg, index) => (
                    <div key={`${msg.sender}-${index}`} className={`message ${msg.sender}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {/* Optional: Show typing indicator */}
                {isAssistantTyping && (
                    <div className="message assistant typing-indicator">
                        <p><i>Assistant is typing...</i></p>
                    </div>
                )}
                {/* Empty div to scroll to */}
                <div ref={messagesEndRef} />
            </div>
            {/* MODIFIED: Connect input and button */}
            <div className="chat-input-area">
                <input
                    type="text"
                    placeholder="Ask about your schedule..."
                    value={chatInputValue}
                    onChange={handleChatInputChange}
                    onKeyDown={handleChatKeyDown} // Handle Enter key
                    disabled={isAssistantTyping || !selectedMajor} // Disable while typing or no major
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isAssistantTyping || !chatInputValue.trim() || !selectedMajor} // Disable on empty/typing/no major
                >
                    Send
                </button>
            </div>
         </div>
      </div>
      {/* --- End Chat Menu --- */}

      {/* --- Duck Button --- */}
      <button
        className="chat-duck-button"
        onClick={toggleChatMenu}
        aria-label="Open Chat Assistant"
      >
        <Duck3DChat />
      </button>
    </div> // --- End Page Wrapper ---
  );
}

export default Chat;