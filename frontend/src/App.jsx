import React from 'react'; // Good practice to import React
import Duck3D from './Duck3D';
import Contacts from './Contacts';
import About from './About';
import Chat from './Chat';
import ProfessorsPage from './ProfessorsPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cursor from './cursor';
import './App.css';

// Create a navigation component using Link instead of <a>
function Navigation() {
  return (
    <div className="topnav">
      {/* Removed the Ducks/News tab */}
      <Link to="/">Home</Link> 
      <Link to="/contact">Contact</Link>
      <Link to="/about">About</Link>
    </div>
  );
}

// Home component with updated Enter button
function Home() {
  return (
    <div className="fade-container">
      <div className="duck-container">
        <Duck3D />
        {/* If you still want the quack sound, add the hitbox button back here */}
      </div>
      <h1>Welcome To ClassBuilder3D</h1>
      <div className="logo">
        <Link to="/chat"> 
          <button
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '10px 40px',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              outline: '2px solid white'
            }}
          >
            Enter
          </button>
        </Link>
      </div>
      <div className="card">
        <p>The Ultimate Class Scheduling Platform.</p>
      </div>
      <p className="credits">Built By Some People I Guess.</p>
    </div>
  );
}

// Main App component with Router and Routes
function App() {
  return (
    <Router>
      <div>
        <Cursor />
        {/* Only show Navigation on routes where it should appear */}
        <Routes>
          <Route path="/professors" element={<ProfessorsPage />} />
          <Route path="*" element={
            <>
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contacts />} />
                <Route path="/about" element={<About />} />
                <Route path="/chat" element={<Chat />} />
                {/* Removed the news/ducks route */}
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;