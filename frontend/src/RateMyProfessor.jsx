// RateMyProfessor.jsx
import React, { useState, useEffect, useRef } from 'react';

const RateMyProfessors = ({ selectedCourse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);
  
  // Auto-expand when a course is selected
  useEffect(() => {
    if (selectedCourse && !isExpanded) {
      setIsExpanded(true);
      setIsLoading(true);
    }
  }, [selectedCourse]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsLoading(true);
    }
  };

  // Get the search URL for RateMyProfessors
  const getSearchUrl = () => {
    if (!selectedCourse || !selectedCourse.professor) {
      return "https://www.ratemyprofessors.com/school/982";
    }
    
    // Format from "Last, First" to "First Last"
    const parts = selectedCourse.professor.split(', ');
    let formattedName;
    if (parts.length === 2) {
      formattedName = `${parts[1]} ${parts[0]}`;
    } else {
      formattedName = selectedCourse.professor;
    }
    
    // Use the proper URL format for RateMyProfessors
    // This format should directly search for the professor at Stevens
    return `https://www.ratemyprofessors.com/search/professors?q=${encodeURIComponent(formattedName)}&sid=982`;
  };

  // Format professor name for display
  const getProfessorDisplayName = () => {
    if (!selectedCourse || !selectedCourse.professor) return "";
    
    const parts = selectedCourse.professor.split(', ');
    if (parts.length === 2) {
      return `${parts[1]} ${parts[0]}`;
    }
    return selectedCourse.professor;
  };

  return (
    <div className="rmp-section">
      <h3>Professor Ratings</h3>
      <div className="rmp-container">
        <div className="rmp-header">
          <div className="rmp-title">
            <h4>
              {selectedCourse 
                ? `${selectedCourse.name.split(' - ')[0]} - Prof. ${getProfessorDisplayName()}`
                : "Stevens Institute of Technology Professors"
              }
            </h4>
          </div>
          <button 
            className="rmp-toggle-button" 
            onClick={toggleExpand}
          >
            {isExpanded ? 'Close Ratings' : 'View Ratings'}
          </button>
        </div>
        
        <div className={`rmp-content ${isExpanded ? '' : 'collapsed'}`}>
          {isExpanded && (
            <div className="rmp-iframe-container">
              <iframe 
                ref={iframeRef}
                src={getSearchUrl()}
                className="rmp-iframe"
                title={selectedCourse 
                  ? `RateMyProfessors - ${getProfessorDisplayName()}` 
                  : "RateMyProfessors - Stevens Institute of Technology"
                }
                onLoad={handleIframeLoad}
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
              {isLoading && (
                <div className="rmp-loading-overlay">
                  <div className="rmp-spinner"></div>
                  <span>
                    {selectedCourse 
                      ? `Loading ratings for ${getProfessorDisplayName()}...`
                      : "Loading professor ratings..."
                    }
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="rmp-info">
          <span>
            {selectedCourse 
              ? `Viewing ratings for ${getProfessorDisplayName()}`
              : "Find professor ratings to help with your course selection"
            }
          </span>
          <a 
            href={getSearchUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              window.open(getSearchUrl(), "_blank");
            }}
          >
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
};

export default RateMyProfessors;