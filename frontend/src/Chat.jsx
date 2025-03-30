// src/Chat.jsx


import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Duck3DChat from './Duck3Dchat';
import './Chat.css';
import RateMyProfessors from './RateMyProfessor'; // Import the RateMyProfessors component


// --- Define Majors List ---
const majorsList = [
  "Computer Science",
  "Cybersecurity",
];


// --- Define Courses by Major with Professor Information ---
const coursesByMajor = {
  "Computer Science": [
    { id: "cs115", name: "CS 115 - Introduction to Computer Science", professor: "Mordohai, Philippos" },
    { id: "cs135", name: "CS 135 - Discrete Structures", professor: "Bonelli, Eduardo" },
    { id: "cs146", name: "CS 146 - Introduction to Web Programming", professor: "Duggan, Dominic" },
    { id: "cs284", name: "CS 284 - Data Structures", professor: "Borowski, Samuel" },
    { id: "cs385", name: "CS 385 - Algorithms", professor: "Nicolosi, Antonio" },
    { id: "cs392", name: "CS 392 - Systems Programming", professor: "Bhattacharjee, Samson" },
    { id: "cs396", name: "CS 396 - Security, Privacy & Society", professor: "Moarref, Sajjad" },
    { id: "cs442", name: "CS 442 - Database Management Systems", professor: "Rowland, David" },
    { id: "cs496", name: "CS 496 - Programming Languages", professor: "Bonelli, Eduardo" },
    { id: "cs511", name: "CS 511 - Concurrent Programming", professor: "Nicolosi, Antonio" },
    { id: "cs546", name: "CS 546 - Web Programming I", professor: "Hill, Christopher" },
    { id: "cs554", name: "CS 554 - Web Programming II", professor: "Hill, Christopher" },
    { id: "ma222", name: "MA 222 - Probability and Statistics", professor: "Chen, Yi" },
    { id: "ma123", name: "MA 123 - Calculus I", professor: "Zaleski, Anthony" },
    { id: "ma124", name: "MA 124 - Calculus II", professor: "Zaleski, Anthony" },
  ],
  "Cybersecurity": [
    { id: "cs115", name: "CS 115 - Introduction to Computer Science", professor: "Mordohai, Philippos" },
    { id: "cs135", name: "CS 135 - Discrete Structures", professor: "Bonelli, Eduardo" },
    { id: "cs284", name: "CS 284 - Data Structures", professor: "Borowski, Samuel" },
    { id: "ma123", name: "MA 123 - Calculus I", professor: "Zaleski, Anthony" },
    { id: "ma222", name: "MA 222 - Probability and Statistics", professor: "Chen, Yi" },
    { id: "cs392", name: "CS 392 - Systems Programming", professor: "Bhattacharjee, Samson" },
    { id: "cs306", name: "CS 306 - Introduction to IT Security", professor: "Prabhu, Srilaxmi" },
    { id: "cs370", name: "CS 370 - Introduction to Operating Systems", professor: "Geller, Mykhailo" },
    { id: "cs488", name: "CS 488 - Computer Architecture", professor: "Ou, Jun" },
    { id: "cs492", name: "CS 492 - Operating Systems Security", professor: "Memon, Nasir" },
    { id: "cs494", name: "CS 494 - Network and Internet Security", professor: "Bhattacharjee, Samson" },
    { id: "cs573", name: "CS 573 - Fundamentals of CyberSecurity", professor: "Geller, Mykhailo" },
    { id: "cs576", name: "CS 576 - Systems Security", professor: "Zhang, Wendy" },
    { id: "cs577", name: "CS 577 - Reverse Engineering and Application Analysis", professor: "Prabhu, Srilaxmi" },
    { id: "cs578", name: "CS 578 - Privacy in a Networked World", professor: "Nicolosi, Antonio" },
    { id: "cs579", name: "CS 579 - Foundations of Cryptography", professor: "Bajaj, Neeraj" },
    { id: "cs588", name: "CS 588 - Network Management and Security", professor: "Ananta, Balaji" },
    { id: "cs519", name: "CS 519 - Introduction to E-Commerce Security", professor: "Santos, Paulo" },
    { id: "cs549", name: "CS 549 - Introduction to Computer Networks", professor: "Ananta, Balaji" },
    { id: "cs571", name: "CS 571 - Cybersecurity Ethics", professor: "Rowland, David" },
  ],
};
// --- END COURSE DATA ---




function Chat() {
  // State for Major Menu
  const [isMajorMenuOpen, setIsMajorMenuOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectContainerRef = useRef(null);


  // State for Tag Input 1 (Courses Taken)
  const [takenInputValue, setTakenInputValue] = useState("");
  const [takenTags, setTakenTags] = useState([]);
  const [takenTagsData, setTakenTagsData] = useState([]); // Store the full course objects
  const [isTakenSuggestionsOpen, setIsTakenSuggestionsOpen] = useState(false);


  // State for Tag Input 2 (Courses Desired)
  const [desiredInputValue, setDesiredInputValue] = useState("");
  const [desiredTags, setDesiredTags] = useState([]);
  const [desiredTagsData, setDesiredTagsData] = useState([]); // Store the full course objects
  const [isDesiredSuggestionsOpen, setIsDesiredSuggestionsOpen] = useState(false);


  // --- State for Chat Menu ---
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
 
  // State for selected professor, active course ID, and selected course
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [activeCourseId, setActiveCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);


  // --- NEW State for Chat ---
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I help you plan your schedule today? Please select your major first if you haven\'t.' }
  ]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const messagesEndRef = useRef(null); // Ref for scrolling


  useEffect(() => {
    // Add no-scroll class to body when menu is open
    if (isMajorMenuOpen || isChatMenuOpen) {
      document.body.classList.add('menu-open-no-scroll');
      document.documentElement.classList.add('menu-open-no-scroll');
    } else {
      document.body.classList.remove('menu-open-no-scroll');
      document.documentElement.classList.remove('menu-open-no-scroll');
    }


    // Cleanup function
    return () => {
      document.body.classList.remove('menu-open-no-scroll');
      document.documentElement.classList.remove('menu-open-no-scroll');
    };
  }, [isMajorMenuOpen, isChatMenuOpen]);
 
  // --- NEW useEffect for Scrolling Chat ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scroll whenever messages change


  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (selectContainerRef.current && !selectContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }


    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // --- Menu Logic ---
  const toggleMajorMenu = () => {
    const opening = !isMajorMenuOpen;
    setIsMajorMenuOpen(opening);
    if (opening) setIsChatMenuOpen(false); // Close chat menu if opening major menu
  };


  const toggleChatMenu = () => {
    const opening = !isChatMenuOpen;
    setIsChatMenuOpen(opening);
    if (opening) setIsMajorMenuOpen(false); // Close major menu if opening chat menu
  };


  // --- Backdrop Click Handler ---
  const handleBackdropClick = () => {
    if (isMajorMenuOpen) {
      toggleMajorMenu(); // Close major menu
    } else if (isChatMenuOpen) {
      toggleChatMenu(); // Close chat menu
    }
  };


  const handleMajorChange = (event) => {
    const newMajor = event.target.value;
    setSelectedMajor(newMajor);
    setTakenTags([]);
    setTakenTagsData([]);
    setDesiredTags([]);
    setDesiredTagsData([]);
    setTakenInputValue("");
    setDesiredInputValue("");
    setIsTakenSuggestionsOpen(false);
    setIsDesiredSuggestionsOpen(false);
    setSelectedProfessor(""); // Reset selected professor
    setActiveCourseId(""); // Reset active course
    setSelectedCourse(null); // Reset selected course
  };


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
   
    // Add animation class when opening
    if (!isDropdownOpen && dropdownRef.current) {
      dropdownRef.current.classList.add('animate-dropdown');
      // Remove the class after animation completes
      setTimeout(() => {
        if (dropdownRef.current) {
          dropdownRef.current.classList.remove('animate-dropdown');
        }
      }, 500);
    }
  };


  const handleMajorSelect = (major) => {
    setSelectedMajor(major);
    setIsDropdownOpen(false);
   
    // Reset course inputs
    setTakenTags([]);
    setTakenTagsData([]);
    setDesiredTags([]);
    setDesiredTagsData([]);
    setTakenInputValue("");
    setDesiredInputValue("");
    setIsTakenSuggestionsOpen(false);
    setIsDesiredSuggestionsOpen(false);
    setSelectedProfessor(""); // Reset selected professor
    setActiveCourseId(""); // Reset active course
    setSelectedCourse(null); // Reset selected course
   
    // Optionally add a chat message confirming major selection
    setMessages(prev => [...prev, { sender: 'assistant', text: `Major set to ${major}. Now you can add courses taken/desired.` }]);
  };


  // --- Tag Input Logic (Updated) ---
  const availableCourses = useMemo(() => coursesByMajor[selectedMajor] || [], [selectedMajor]);


  const filteredTakenSuggestions = useMemo(() => {
    if (!takenInputValue) return [];
    const lowerCaseInput = takenInputValue.toLowerCase();
    return availableCourses.filter(course =>
      course.name.toLowerCase().includes(lowerCaseInput) &&
      !takenTags.includes(course.name) &&
      !desiredTags.includes(course.name)
    );
  }, [takenInputValue, availableCourses, takenTags, desiredTags]);


  const handleTakenInputChange = (event) => {
    const value = event.target.value;
    setTakenInputValue(value);
    const suggestions = availableCourses.filter(course =>
      value &&
      course.name.toLowerCase().includes(value.toLowerCase()) &&
      !takenTags.includes(course.name) &&
      !desiredTags.includes(course.name)
    );
    setIsTakenSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };


  const handleSelectTakenTag = useCallback((course) => {
    if (!takenTags.includes(course.name)) {
      setTakenTags(prevTags => [...prevTags, course.name]);
      setTakenTagsData(prevData => [...prevData, course]);
    }
    setTakenInputValue("");
    setIsTakenSuggestionsOpen(false);
  }, [takenTags, desiredTags]);


  const handleRemoveTakenTag = useCallback((tagName) => {
    // Find the course that is being removed
    const courseToRemove = takenTagsData.find(course => course.name === tagName);
   
    // If the removed course is the active one, reset selections
    if (courseToRemove && courseToRemove.id === activeCourseId) {
      setSelectedProfessor("");
      setActiveCourseId("");
      setSelectedCourse(null);
    }
   
    setTakenTags(prevTags => prevTags.filter(tag => tag !== tagName));
    setTakenTagsData(prevData => prevData.filter(course => course.name !== tagName));
  }, [activeCourseId, takenTagsData]);


  const handleTakenKeyDown = (event) => {
    if (event.key === 'Enter' && takenInputValue && filteredTakenSuggestions.length > 0) {
      handleSelectTakenTag(filteredTakenSuggestions[0]);
      event.preventDefault();
    }
    else if (event.key === 'Backspace' && !takenInputValue && takenTags.length > 0) {
      handleRemoveTakenTag(takenTags[takenTags.length - 1]);
    }
  };


  const filteredDesiredSuggestions = useMemo(() => {
    if (!desiredInputValue) return [];
    const lowerCaseInput = desiredInputValue.toLowerCase();
    return availableCourses.filter(course =>
      course.name.toLowerCase().includes(lowerCaseInput) &&
      !desiredTags.includes(course.name) &&
      !takenTags.includes(course.name)
    );
  }, [desiredInputValue, availableCourses, desiredTags, takenTags]);


  const handleDesiredInputChange = (event) => {
    const value = event.target.value;
    setDesiredInputValue(value);
    const suggestions = availableCourses.filter(course =>
      value &&
      course.name.toLowerCase().includes(value.toLowerCase()) &&
      !desiredTags.includes(course.name) &&
      !takenTags.includes(course.name)
    );
    setIsDesiredSuggestionsOpen(value.length > 0 && suggestions.length > 0);
  };


  const handleSelectDesiredTag = useCallback((course) => {
    if (!desiredTags.includes(course.name)) {
      setDesiredTags(prevTags => [...prevTags, course.name]);
      setDesiredTagsData(prevData => [...prevData, course]);
     
      // Automatically select the professor for the newly added desired course
      setSelectedProfessor(course.professor);
      setActiveCourseId(course.id);
      setSelectedCourse(course);
    }
    setDesiredInputValue("");
    setIsDesiredSuggestionsOpen(false);
  }, [desiredTags, takenTags]);


  const handleRemoveDesiredTag = useCallback((tagName) => {
    // Find the course that is being removed
    const courseToRemove = desiredTagsData.find(course => course.name === tagName);
   
    // If the removed course is the active one, reset selections
    if (courseToRemove && courseToRemove.id === activeCourseId) {
      setSelectedProfessor("");
      setActiveCourseId("");
      setSelectedCourse(null);
    }
   
    setDesiredTags(prevTags => prevTags.filter(tag => tag !== tagName));
    setDesiredTagsData(prevData => prevData.filter(course => course.name !== tagName));
  }, [activeCourseId, desiredTagsData]);


  const handleDesiredKeyDown = (event) => {
    if (event.key === 'Enter' && desiredInputValue && filteredDesiredSuggestions.length > 0) {
      handleSelectDesiredTag(filteredDesiredSuggestions[0]);
      event.preventDefault();
    }
    else if (event.key === 'Backspace' && !desiredInputValue && desiredTags.length > 0) {
      handleRemoveDesiredTag(desiredTags[desiredTags.length - 1]);
    }
  };


  // Handle clicking on a course to view its professor
  const handleCourseClick = (course, isDesired) => {
    if (isDesired) {
      setSelectedProfessor(course.professor);
      setActiveCourseId(course.id);
     
      // Pass the complete course object to RateMyProfessors component
      setSelectedCourse(course);
    }
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
      plan: takenTags.map(tag => tag), // Assuming 'plan' corresponds to courses taken
      school: selectedMajor, // Assuming 'school' corresponds to the major
      requests: trimmedInput  // The user's query
      // NOTE: Your backend uses studyPlans[school]. We send the major name.
      // Ensure your backend logic (studyPlans[school]) correctly uses the major name string.
      // Also, the backend doesn't seem to use 'desired courses' yet, but we have them in state (desiredTags).
    };


    try {
      const response = await fetch(`http://localhost:3000/schedule`, {
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
                  {takenTagsData.map((course) => (
                    <div
                      key={course.id}
                      className="tag-chip"
                      // Taken courses don't trigger professor lookup
                    >
                      <span>{course.name}</span>
                      <button
                        onClick={(e) => {
                          handleRemoveTakenTag(course.name);
                        }}
                        className="remove-tag-button"
                        aria-label={`Remove ${course.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="tag-input-field"
                    value={takenInputValue}
                    onChange={handleTakenInputChange}
                    onKeyDown={handleTakenKeyDown}
                    onFocus={() => setIsTakenSuggestionsOpen(takenInputValue.length > 0 && filteredTakenSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setIsTakenSuggestionsOpen(false), 150)}
                    placeholder="Search courses taken..."
                    disabled={!selectedMajor}
                  />
                  {isTakenSuggestionsOpen && filteredTakenSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredTakenSuggestions.slice(0, 7).map((course) => (
                        <li
                          key={course.id}
                          className="suggestion-item"
                          onMouseDown={() => handleSelectTakenTag(course)}
                        >
                          {course.name} <span className="suggestion-professor">({course.professor})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Courses Desired Input Section */}
          <div className="tag-input-section section-spacer">
            <h3>Courses Desired</h3>
             {!selectedMajor && (<div/>)} {/* Empty div to maintain structure */}
            {selectedMajor && (
              <div className="tag-input-container">
                <div className="selected-tags-area">
                  {desiredTagsData.map((course) => (
                    <div
                      key={course.id}
                      className={`tag-chip ${activeCourseId === course.id ? 'active' : ''}`}
                      onClick={() => handleCourseClick(course, true)}
                    >
                      <span>{course.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent click
                          handleRemoveDesiredTag(course.name);
                        }}
                        className="remove-tag-button"
                        aria-label={`Remove ${course.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="tag-input-field"
                    value={desiredInputValue}
                    onChange={handleDesiredInputChange}
                    onKeyDown={handleDesiredKeyDown}
                    onFocus={() => setIsDesiredSuggestionsOpen(desiredInputValue.length > 0 && filteredDesiredSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setIsDesiredSuggestionsOpen(false), 150)}
                    placeholder="Search courses desired..."
                    disabled={!selectedMajor}
                  />
                  {isDesiredSuggestionsOpen && filteredDesiredSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredDesiredSuggestions.slice(0, 7).map((course) => (
                        <li
                          key={course.id}
                          className="suggestion-item"
                          onMouseDown={() => handleSelectDesiredTag(course)}
                        >
                          {course.name} <span className="suggestion-professor">({course.professor})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
         
          {/* RateMyProfessors Section - Pass the selected course object */}
          <RateMyProfessors selectedCourse={selectedCourse} />
        </div>
      </div>


      {/* --- Menu & Overlay Components --- */}
      <button className="select-major-button" onClick={toggleMajorMenu}>
        {selectedMajor ? `Major: ${selectedMajor}` : "Select Major"}
      </button>


      {/* Backdrop - show if *either* menu is open */}
      <div
        className={`menu-backdrop-blur ${isMajorMenuOpen || isChatMenuOpen ? 'open' : ''}`}
        onClick={handleBackdropClick}
      ></div>


      {/* Major Menu */}
      <div className={`major-menu ${isMajorMenuOpen ? 'open' : ''}`}>
        <button className="menu-close-button" onClick={toggleMajorMenu} aria-label="Close menu">×</button>
        <h2>Choose Your Major</h2>
        <p>Currently selected: {selectedMajor || "None"}</p>


        {/* Custom styled dropdown with improved button appearance */}
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


        {/* Fallback for traditional browsers (hidden but functional) */}
        <select
          className="major-select-dropdown"
          value={selectedMajor}
          onChange={handleMajorChange}
          style={{ display: 'none' }}
        >
          <option value="" disabled>--- Select a Major ---</option>
          {majorsList.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
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
