// src/cursor.jsx
import React, { useEffect, useRef } from 'react';
import './cursor.css';

const Cursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const cursorRef = useRef(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let trailElements = [];
    let trailElementsCount = 20;
    
    // Create trail elements
    for (let i = 0; i < trailElementsCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = 1 - (i / trailElementsCount);
      trail.style.transform = `translate(-50%, -50%) scale(${1 - (i / trailElementsCount) * 0.8})`;
      cursor.appendChild(trail);
      trailElements.push({
        element: trail,
        x: 0,
        y: 0
      });
    }
    
    // Update cursor position
    const updateCursorPosition = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update dot position immediately
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };
    
    document.addEventListener('mousemove', updateCursorPosition);
    
    // Interactive elements effect
    const addHoverListeners = () => {
      const hoverElements = document.querySelectorAll('a, button, .cursor-hover');
      
      hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          cursorDot.style.width = '12px';
          cursorDot.style.height = '12px';
          cursorOutline.style.width = '60px';
          cursorOutline.style.height = '60px';
          cursorOutline.style.borderColor = 'rgba(100, 255, 218, 0.5)';
        });
        
        element.addEventListener('mouseleave', () => {
          cursorDot.style.width = '8px';
          cursorDot.style.height = '8px';
          cursorOutline.style.width = '40px';
          cursorOutline.style.height = '40px';
          cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
      });
    };
    
    // Initial setup of hover listeners
    addHoverListeners();
    
    // Setup a MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Animation loop for smooth following
    function animateCursor() {
      // Smooth following for outline
      const dx = mouseX - outlineX;
      const dy = mouseY - outlineY;
      
      outlineX += dx * 0.15;
      outlineY += dy * 0.15;
      
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      
      // Update trail positions
      for (let i = 0; i < trailElements.length; i++) {
        const trail = trailElements[i];
        
        if (i === 0) {
          const trailDx = mouseX - trail.x;
          const trailDy = mouseY - trail.y;
          
          trail.x += trailDx * 0.3;
          trail.y += trailDy * 0.3;
        } else {
          const prevTrail = trailElements[i - 1];
          const trailDx = prevTrail.x - trail.x;
          const trailDy = prevTrail.y - trail.y;
          
          trail.x += trailDx * 0.3;
          trail.y += trailDy * 0.3;
        }
        
        trail.element.style.left = `${trail.x}px`;
        trail.element.style.top = `${trail.y}px`;
      }
      
      requestAnimationFrame(animateCursor);
    }
    
    // Hide cursor when mouse leaves window
    const handleMouseOut = (e) => {
      if (e.relatedTarget === null) {
        cursor.style.opacity = 0;
      }
    };
    
    const handleMouseOver = () => {
      cursor.style.opacity = 1;
    };
    
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseover', handleMouseOver);
    
    // Set cursor to none on all elements
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, input').forEach(el => {
      el.style.cursor = 'none';
    });
    
    // Start animation
    const animationFrame = requestAnimationFrame(animateCursor);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseover', handleMouseOver);
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      
      // Remove trail elements
      trailElements.forEach(trail => {
        if (trail.element.parentNode) {
          trail.element.parentNode.removeChild(trail.element);
        }
      });
      
      // Restore default cursor
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div className="cursor" ref={cursorRef}>
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>
    </div>
  );
};

export default Cursor;