// src/Chat.jsx

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Duck3DChat from './Duck3Dchat';
import './Chat.css';
import RateMyProfessors from './RateMyProfessor'; // Import the RateMyProfessors component
import initialAvailableRegistrations from '../public/available_registrations'; // Import from file

// Helper function to format times
const formatTimes = (times) => {
  if (!times || times.length < 2) return 'Time TBD';
  
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };
  
  return `${formatTime(times[0])} - ${formatTime(times[1])}`;
};

// --- Define Majors List ---
const majorsList = [
  "Computer Science",
  "Cybersecurity",
];

function Chat() {
  // State for Major Menu
  const [isMajorMenuOpen, setIsMajorMenuOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectContainerRef = useRef(null);

  // State for available courses and API data
  const [availableRegistrations, setAvailableRegistrations] = useState(initialAvailableRegistrations || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // --- State for Chat ---
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I help you plan your schedule today? Please select your major first if you haven\'t.' }
  ]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const messagesEndRef = useRef(null); // Ref for scrolling

  // Fetch available registrations when major changes
  useEffect(() => {
    if (selectedMajor) {
      // Add a message to inform the user about the fetching
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: `Loading courses for ${selectedMajor}. Please wait...` 
      }]);
      
      // Call the function to fetch available registrations
      fetchAvailableRegistrations(selectedMajor);
      
      // Set a fallback timeout in case the fetch takes too long
      const fallbackTimer = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setMessages(prev => [...prev, { 
            sender: 'assistant', 
            text: `Loading is taking longer than expected. Using locally stored course data for now.` 
          }]);
          
          // Use the initial data as fallback
          if (!availableRegistrations && initialAvailableRegistrations) {
            setAvailableRegistrations(initialAvailableRegistrations);
          }
        }
      }, 5000); // 5 second timeout
      
      // Clean up the timer
      return () => clearTimeout(fallbackTimer);
    }
  }, [selectedMajor]);

  // Function to fetch available registrations from the API
  const fetchAvailableRegistrations = async (program) => {
    try {
      setLoading(true);
      
      // Build query params
      const queryParams = new URLSearchParams();
      if (program) {
        queryParams.append('program', program);
      }
      
      // Use the full backend URL
      // Make sure this URL matches your backend server
      const url = `http://localhost:3000/available_registrations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      console.log("Fetching from URL:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch available registrations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response data:", data);
      setAvailableRegistrations(data);
      
      // Add a message to inform the user
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: `I've loaded the courses for ${program} from the registration system. You can now select courses you've taken or want to take.` 
      }]);
      
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError(error.message);
      
      // Add an error message to the chat
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: `I had trouble connecting to the course registration system. Using locally stored course data instead.` 
      }]);
      
      // Fall back to using initial data
      setAvailableRegistrations(initialAvailableRegistrations);
      
    } finally {
      setLoading(false);
    }
  };

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

  // --- useEffect for Scrolling Chat ---
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
    resetSelections();
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
    resetSelections();
  };

  // Helper function to reset all selections
  const resetSelections = () => {
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
  };

  // --- Get available courses based on the API data ---
  // Define availableCourses using a useMemo to derive from availableRegistrations
  const availableCourses = useMemo(() => {
    if (!availableRegistrations) return [];
    
    // Helper function to create course objects with consistent format
    const createCourseObject = (course, index) => {
      // Ensure code and id are strings
      const courseCode = course.code ? String(course.code).trim() : '';
      const courseId = course.id ? String(course.id).trim() : '';
      const courseName = course.name ? String(course.name).trim() : '';
      
      // Create combined code (like "HASS 105") - notice the trim to remove extra spaces
      const combinedCode = courseCode && courseId ? 
        `${courseCode} ${courseId}`.trim() : 
        courseCode || courseId || '';
      
      // Create a searchable string that includes all relevant information
      const searchableString = [
        combinedCode,
        courseName,
        course.professor || course.instructor || '',
        course.section || ''
      ].filter(Boolean).join(' ').toLowerCase();
      
      return {
        id: courseId || `course-${index}`,
        uniqueId: course.uniqueId || `${courseCode}-${courseId}-${course.section || index}`,
        name: courseName || `${courseCode} ${courseId}`,
        professor: course.professor || course.instructor || "Unknown",
        code: courseCode,
        courseId: courseId,
        combinedCode: combinedCode,
        searchableString: searchableString,
        section: course.section || '',
        days: course.days || [],
        times: course.times || []
      };
    };
    
    // Check if the data has the expected structure
    if (availableRegistrations.availableSections && Array.isArray(availableRegistrations.availableSections)) {
      return availableRegistrations.availableSections.map(createCourseObject);
    }
    
    // Fallback for other data structures
    if (Array.isArray(availableRegistrations)) {
      return availableRegistrations.map(createCourseObject);
    }
    
    return []; // Return empty array if no valid data
  }, [availableRegistrations]);

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
    
    // Show suggestions instantly as user types, with more flexible matching
    if (value.length > 0) {
      const lowerCaseValue = value.toLowerCase();
      const suggestions = availableCourses.filter(course => {
        // Match against course name or course code
        const nameMatch = course.name && course.name.toLowerCase().includes(lowerCaseValue);
        const codeMatch = course.code && course.code.toLowerCase().includes(lowerCaseValue);
        
        // Don't show courses already selected
        const notSelected = !takenTags.includes(course.name) && !desiredTags.includes(course.name);
        
        return (nameMatch || codeMatch) && notSelected;
      });
      
      setIsTakenSuggestionsOpen(suggestions.length > 0);
    } else {
      setIsTakenSuggestionsOpen(false);
    }
  };

  const handleSelectTakenTag = useCallback((course) => {
    if (!takenTags.includes(course.name)) {
      setTakenTags(prevTags => [...prevTags, course.name]);
      setTakenTagsData(prevData => [...prevData, course]);
    }
    setTakenInputValue("");
    setIsTakenSuggestionsOpen(false);
  }, [takenTags]);

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
    
    // Show suggestions instantly as user types, with more flexible matching
    if (value.length > 0) {
      const lowerCaseValue = value.toLowerCase();
      const suggestions = availableCourses.filter(course => {
        // Match against course name or course code
        const nameMatch = course.name && course.name.toLowerCase().includes(lowerCaseValue);
        const codeMatch = course.code && course.code.toLowerCase().includes(lowerCaseValue);
        
        // Don't show courses already selected
        const notSelected = !desiredTags.includes(course.name) && !takenTags.includes(course.name);
        
        return (nameMatch || codeMatch) && notSelected;
      });
      
      setIsDesiredSuggestionsOpen(suggestions.length > 0);
    } else {
      setIsDesiredSuggestionsOpen(false);
    }
  };

  const handleSelectDesiredTag = useCallback((course) => {
    if (!desiredTags.includes(course.name)) {
      // Ensure professor information is available
      const professorName = course.professor || course.instructor || "Unknown";
      const enhancedCourse = {
        ...course,
        professor: professorName
      };
      
      setDesiredTags(prevTags => [...prevTags, course.name]);
      setDesiredTagsData(prevData => [...prevData, enhancedCourse]);
     
      // Automatically select the professor for the newly added desired course
      setSelectedProfessor(professorName);
      setActiveCourseId(course.id);
      
      // Console log for debugging
      console.log("Selected desired course:", enhancedCourse);
      
      // Set selected course with professor info
      setSelectedCourse(enhancedCourse);
      
      // Add a message to chat about the course
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `Added ${course.name} to your desired courses. This course is taught by ${professorName}.`
        }
      ]);
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
      // Extract professor name
      const professorName = course.professor || course.instructor || "Unknown";
      setSelectedProfessor(professorName);
      setActiveCourseId(course.id);
     
      // Add console logs for debugging
      console.log("Course clicked:", course);
      console.log("Setting selected professor to:", professorName);
      
      // Pass the complete course object to RateMyProfessors component
      setSelectedCourse({
        ...course,
        professor: professorName // Ensure professor is set
      });
      
      // Add a message to the chat about the selection
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'assistant', 
          text: `You've selected ${course.name} taught by ${professorName}. What would you like to know about this course?` 
        }
      ]);
    }
  };

  // --- Chat Functionality ---
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
          {loading && <p className="loading-message">Loading courses, please wait...</p>}
          
          {/* Display available sections if they exist */}
          {availableRegistrations && availableRegistrations.availableSections && availableRegistrations.availableSections.length > 0 && (
            <div className="available-sections">
              <h3>Available Course Sections</h3>
              <ul className="sections-list">
                {availableRegistrations.availableSections.map((section, index) => (
                  <li key={index} className="section-item">
                    {section.code} {section.id} Section {section.section}: {section.name}
                    {section.instructor && <span className="section-instructor"> - {section.instructor}</span>}
                    {section.days && section.days.length > 0 && (
                      <span className="section-days"> on {section.days.join(', ')}</span>
                    )}
                    {section.times && section.times.length > 0 && (
                      <span className="section-times"> at {formatTimes(section.times)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
                    disabled={!selectedMajor || loading}
                  />
                  {isTakenSuggestionsOpen && filteredTakenSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredTakenSuggestions.slice(0, 7).map((course) => (
                        <li
                          key={course.id}
                          className="suggestion-item"
                          onMouseDown={() => handleSelectTakenTag(course)}
                        >
                          {course.combinedCode && <strong>{course.combinedCode} </strong>}
                          {!course.combinedCode && course.code && <strong>{course.code} </strong>}
                          {course.name} 
                          {course.professor && <span className="suggestion-professor">({course.professor})</span>}
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
                    disabled={!selectedMajor || loading}
                  />
                  {isDesiredSuggestionsOpen && filteredDesiredSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {filteredDesiredSuggestions.slice(0, 7).map((course) => (
                        <li
                          key={course.id}
                          className="suggestion-item"
                          onMouseDown={() => handleSelectDesiredTag(course)}
                        >
                          {course.combinedCode && <strong>{course.combinedCode} </strong>}
                          {!course.combinedCode && course.code && <strong>{course.code} </strong>}
                          {course.name} 
                          {course.professor && <span className="suggestion-professor">({course.professor})</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
         
          {/* RateMyProfessors Section - Pass the selected course object */}
          <div className="rate-my-professors-section">
            <h3>Professor Information</h3>
            {selectedCourse ? (
              <div className="professor-info">
                <p><strong>Selected Course:</strong> {selectedCourse.name}</p>
                <p><strong>Professor:</strong> {selectedCourse.professor}</p>
                <RateMyProfessors selectedCourse={selectedCourse} />
              </div>
            ) : (
              <p className="no-professor-selected">
                Click on a course in "Courses Desired" to view professor information
              </p>
            )}
          </div>
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

      {/* --- Chat Menu --- */}
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
            {/* Render actual messages */}
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
            {/* Chat input and button */}
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