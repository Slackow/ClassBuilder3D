import React, { useState, useEffect, useRef } from 'react';

// WeeklyCalendar component for scheduling with direct block creation
const WeeklyCalendar = ({ desiredCourses = [], takenCourses = [] }) => {
  // Days of the week for the calendar
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Time slots from 8 AM to 8 PM in 30-minute increments
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    timeSlots.push(`${displayHour}:00 ${period}`);
    if (hour < 20) {
      timeSlots.push(`${displayHour}:30 ${period}`);
    }
  }

  // State for tracking schedule blocks - initialize from localStorage if available
  const [scheduleBlocks, setScheduleBlocks] = useState(() => {
    try {
      const savedBlocks = localStorage.getItem('weeklyScheduleBlocks');
      return savedBlocks ? JSON.parse(savedBlocks) : [];
    } catch (error) {
      console.error("Error loading blocks from localStorage:", error);
      return [];
    }
  });
  
  // State for tracking the current drag or creation operation
  const [currentAction, setCurrentAction] = useState(null);
  
  // State for the block being created or edited
  const [editingBlock, setEditingBlock] = useState(null);

  // Counter for generating unique block IDs
  const blockIdCounter = useRef(Date.now());

  // Track active course IDs to avoid duplication when courses change
  const [activeCourseIds, setActiveCourseIds] = useState(() => {
    try {
      const saved = localStorage.getItem('activeCourseIds');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading course IDs from localStorage:", error);
      return [];
    }
  });
  
  // Save blocks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('weeklyScheduleBlocks', JSON.stringify(scheduleBlocks));
    } catch (error) {
      console.error("Error saving blocks to localStorage:", error);
    }
  }, [scheduleBlocks]);

  // Save active course IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('activeCourseIds', JSON.stringify(activeCourseIds));
    } catch (error) {
      console.error("Error saving course IDs to localStorage:", error);
    }
  }, [activeCourseIds]);
  
  // Convert time string to minutes since start of day for calculations
  const timeToMinutes = (timeString) => {
    const [timeWithoutPeriod, period] = timeString.split(' ');
    let [hours, minutes] = timeWithoutPeriod.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };
  
  // Convert minutes back to time string
  const minutesToTime = (minutes) => {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
  };
  
  // Generate a unique ID for new blocks
  const generateBlockId = () => {
    blockIdCounter.current += 1;
    return `block-${blockIdCounter.current}`;
  };

  // Handle starting a drag to create a new block
  const handleCellMouseDown = (day, time) => {
    // Check if cell is already occupied
    const startMinutes = timeToMinutes(time);
    const cellOccupied = scheduleBlocks.some(block => {
      return block.day === day && 
        startMinutes >= timeToMinutes(block.startTime) && 
        startMinutes < timeToMinutes(block.endTime);
    });
    
    if (cellOccupied) return;
    
    setCurrentAction({
      type: 'create',
      day,
      startTime: time,
      endTime: time,
    });
  };
  
  // Handle dragging to extend the time block
  const handleCellMouseEnter = (day, time) => {
    if (!currentAction || currentAction.day !== day) return;
    
    const startMinutes = timeToMinutes(currentAction.startTime);
    const currentMinutes = timeToMinutes(time);
    
    if (currentMinutes >= startMinutes) {
      setCurrentAction({
        ...currentAction,
        endTime: time,
      });
    }
  };
  
  // Handle releasing the mouse to finalize the time block
  const handleCellMouseUp = () => {
    if (!currentAction) return;
    
    // Only create blocks that span at least 30 minutes
    const startMinutes = timeToMinutes(currentAction.startTime);
    const endMinutes = timeToMinutes(currentAction.endTime);
    
    if (endMinutes > startMinutes) {
      // Create a new block directly without opening the edit modal first
      const newBlock = {
        id: generateBlockId(),
        day: currentAction.day,
        startTime: currentAction.startTime,
        endTime: currentAction.endTime,
        name: `Block ${scheduleBlocks.length + 1}`, // Default name
        color: getRandomColor(),
        isUserCreated: true,
      };
      
      // Add the new block to the schedule
      setScheduleBlocks(prev => [...prev, newBlock]);
    }
    
    setCurrentAction(null);
  };
  
  // Generate a random color for the block
  const getRandomColor = () => {
    const colors = [
      'rgba(75, 192, 192, 0.7)',  // Teal
      'rgba(255, 159, 64, 0.7)',  // Orange
      'rgba(153, 102, 255, 0.7)', // Purple
      'rgba(54, 162, 235, 0.7)',  // Blue
      'rgba(255, 99, 132, 0.7)',  // Red
      'rgba(255, 205, 86, 0.7)',  // Yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Save the edited block to the schedule
  const saveBlock = () => {
    if (!editingBlock) {
      return;
    }
    
    // If the name is empty, assign a default name
    if (!editingBlock.name.trim()) {
      setEditingBlock(prev => ({
        ...prev,
        name: `Block ${scheduleBlocks.length}`
      }));
    }
    
    setScheduleBlocks(prev => {
      const existing = prev.findIndex(block => block.id === editingBlock.id);
      if (existing >= 0) {
        return prev.map(block => 
          block.id === editingBlock.id ? editingBlock : block
        );
      } else {
        return [...prev, editingBlock];
      }
    });
    
    setEditingBlock(null);
  };
  
  // Delete a block from the schedule
  const deleteBlock = (blockId) => {
    const blockToRemove = scheduleBlocks.find(block => block.id === blockId);
    
    // If it's a course block, also remove it from active course IDs
    if (blockToRemove && blockToRemove.courseId) {
      setActiveCourseIds(prev => prev.filter(id => id !== blockToRemove.courseId));
    }
    
    setScheduleBlocks(prev => prev.filter(block => block.id !== blockId));
    
    if (editingBlock && editingBlock.id === blockId) {
      setEditingBlock(null);
    }
  };
  
  // Edit an existing block
  const editBlock = (block) => {
    setEditingBlock(block);
  };
  
  // Cancel the edit operation
  const cancelEdit = () => {
    setEditingBlock(null);
  };
  
  // Reset the schedule and clear all blocks
  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all schedule blocks?')) {
      setScheduleBlocks([]);
      setActiveCourseIds([]);
    }
  };
  
  // Auto-populate the schedule with courses
  const autoPopulateSchedule = () => {
    if (!desiredCourses || desiredCourses.length === 0) {
      alert('No desired courses to add to schedule. Please add courses first.');
      return;
    }
    
    // Ask if user wants to clear existing blocks
    if (scheduleBlocks.length > 0) {
      if (!window.confirm('This will add course blocks to your schedule. Continue?')) {
        return;
      }
    }
    
    const newBlocks = [...scheduleBlocks];
    const newCourseIds = [...activeCourseIds];
    
    desiredCourses.forEach((course) => {
      // Skip if already added
      if (activeCourseIds.includes(course.id)) return;
      
      // Add to the active course IDs
      newCourseIds.push(course.id);
      
      if (course.days && course.times && course.days.length > 0 && course.times.length >= 2) {
        // Convert course days to our format (e.g., "M" -> "Monday")
        const dayMap = {
          'M': 'Monday',
          'T': 'Tuesday',
          'W': 'Wednesday',
          'R': 'Thursday',
          'F': 'Friday'
        };
        
        // Extract start and end times
        const startMinutes = course.times[0];
        const endMinutes = course.times[1];
        
        const startTime = minutesToTime(startMinutes);
        const endTime = minutesToTime(endMinutes);
        
        // Create a block for each day the course meets
        course.days.forEach(day => {
          const fullDay = dayMap[day] || day;
          if (daysOfWeek.includes(fullDay)) {
            newBlocks.push({
              id: generateBlockId(),
              day: fullDay,
              startTime,
              endTime,
              name: `${course.combinedCode || course.name}`,
              color: getRandomColor(),
              isAutoGenerated: true,
              courseId: course.id,
            });
          }
        });
      }
    });
    
    setScheduleBlocks(newBlocks);
    setActiveCourseIds(newCourseIds);
    
    // Add a delayed confirmation message
    setTimeout(() => {
      const courseCount = desiredCourses.length;
      alert(`Successfully added ${courseCount} course${courseCount !== 1 ? 's' : ''} to your schedule.`);
    }, 100);
  };
  
  // Calculate the visual height for a time block based on start and end times
  const calculateBlockHeight = (startTime, endTime) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const minutesDifference = endMinutes - startMinutes;
    
    // Each 30 minute slot is 40px high, plus 1px for the border
    return (minutesDifference / 30) * 41 - 1;
  };
  
  // Calculate top position for a time block
  const calculateBlockTop = (startTime) => {
    const startIndex = timeSlots.indexOf(startTime);
    // Each slot is 40px high, plus 1px for the border
    return startIndex * 41 + 31; // 31px is the header height
  };
  
  // Add a window event listener to handle mouse up outside the calendar
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (currentAction) {
        handleCellMouseUp(); // Call our mouseup handler to finalize block creation
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [currentAction]); // This dependency is important
  
  return (
    <div className="weekly-calendar-container">
      <div className="calendar-header">
        <h2>Weekly Schedule</h2>
        <div className="calendar-actions">
          <button className="calendar-action-button" onClick={autoPopulateSchedule}>
            Auto-fill from Courses
          </button>
          <button className="calendar-action-button" onClick={handleReset}>
            Clear Schedule
          </button>
        </div>
      </div>
      
      <div className="weekly-calendar">
        {/* Time column */}
        <div className="time-column">
          <div className="empty-corner-cell"></div>
          {timeSlots.map((time, index) => (
            <div key={`time-${index}`} className="time-cell">
              {time}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} className="day-column">
            <div className="day-header">{day}</div>
            {timeSlots.map((time, timeIndex) => (
              <div
                key={`${day}-${time}`}
                className="schedule-cell"
                onMouseDown={() => handleCellMouseDown(day, time)}
                onMouseEnter={() => handleCellMouseEnter(day, time)}
              ></div>
            ))}
            
            {/* Render existing blocks for this day */}
            {scheduleBlocks
              .filter(block => block.day === day)
              .map(block => {
                const blockHeight = calculateBlockHeight(block.startTime, block.endTime);
                const blockTop = calculateBlockTop(block.startTime);
                
                return (
                  <div
                    key={block.id}
                    className={`schedule-block ${block.isAutoGenerated ? 'auto-generated' : ''} ${block.isUserCreated ? 'user-created' : ''}`}
                    style={{
                      top: `${blockTop}px`,
                      height: `${blockHeight}px`,
                      backgroundColor: block.color,
                    }}
                    onClick={() => editBlock(block)}
                  >
                    <div className="block-name">{block.name}</div>
                    <div className="block-time">
                      {block.startTime} - {block.endTime}
                    </div>
                  </div>
                );
              })}
              
            {/* Preview block during drag creation */}
            {currentAction && currentAction.type === 'create' && currentAction.day === day && (
              <div
                className="schedule-block preview"
                style={{
                  top: `${calculateBlockTop(currentAction.startTime)}px`,
                  height: `${calculateBlockHeight(currentAction.startTime, currentAction.endTime)}px`,
                  backgroundColor: 'rgba(100, 100, 100, 0.5)',
                }}
              >
                <div className="block-name">New Block</div>
                <div className="block-time">
                  {currentAction.startTime} - {currentAction.endTime}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Block editing modal */}
      {editingBlock && (
        <div className="block-edit-modal">
          <div className="block-edit-content">
            <h3>{editingBlock.isAutoGenerated ? 'Edit Course Block' : 'Edit Schedule Block'}</h3>
            <div className="form-group">
              <label htmlFor="block-name">Block Name:</label>
              <input
                type="text"
                id="block-name"
                value={editingBlock.name}
                onChange={(e) => setEditingBlock({...editingBlock, name: e.target.value})}
                placeholder="Enter a name for this block"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <div className="block-time-display">
                {editingBlock.day}, {editingBlock.startTime} - {editingBlock.endTime}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="block-color">Color:</label>
              <input
                type="color"
                id="block-color"
                value={editingBlock.color.replace(/[^,]+(?=\))/, '1')}
                onChange={(e) => {
                  const rgba = `rgba(${parseInt(e.target.value.slice(1, 3), 16)}, ${parseInt(e.target.value.slice(3, 5), 16)}, ${parseInt(e.target.value.slice(5, 7), 16)}, 0.7)`;
                  setEditingBlock({...editingBlock, color: rgba});
                }}
              />
            </div>
            <div className="modal-actions">
              <button className="save-button" onClick={saveBlock}>Save</button>
              <button className="cancel-button" onClick={cancelEdit}>Cancel</button>
              <button className="delete-button" onClick={() => deleteBlock(editingBlock.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;