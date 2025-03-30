// src/Chat.jsx

import React from 'react';
import Duck3DChat from './Duck3Dchat'; // <-- Import the correct component
import './Chat.css'; 

function Chat() {
  const handleDuckButtonClick = () => {
    console.log("Duck button clicked!");
    // Add functionality here
  };

  return (
    <div className="chat-fullscreen-container"> 
     <h1>This is the Chat page.</h1>
     {/* Chat interface elements */}

     <button 
       className="chat-duck-button" 
       onClick={handleDuckButtonClick} 
       aria-label="Duck Assistant"
     >
        {/* Use the imported Duck3DChat component */}
        <Duck3DChat /> 
     </button>
    </div>
  );
}

export default Chat;