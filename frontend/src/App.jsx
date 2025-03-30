import Duck3D from './Duck3D';
import Contacts from './Contacts';
import About from './About';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cursor from './cursor';
import './App.css';

// Create a navigation component using Link instead of <a>
function Navigation() {
  return (
    <div className="topnav">
      <Link className="active" to="/">Home</Link>
      <Link to="/news">Ducks</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/about">About</Link>
    </div>
  );
}

// Home component with your original App.jsx content
function Home() {
  return (
    <div className="fade-container">
      <div className="duck-container">
        <Duck3D />
      </div>
      <h1>Welcome To ClassBuilder3D!</h1>
      <div className="logo">
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D"
          target="_blank"
          rel="noreferrer"
        >
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
        </a>
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
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          {/* You can add additional routes for news, about, etc. */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;