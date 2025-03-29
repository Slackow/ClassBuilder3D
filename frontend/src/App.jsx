import Duck3D from './Duck3D';
import './App.css';

function App() {
  return (
    <div className="fade-container">
      <div className="topnav">
        <a className="active" href="home">Home</a>
        <a href="news">News</a>
        <a href="contact">Contact</a>
        <a href="about">About</a>
      </div>
      <div className="duck-container">
        <Duck3D />
      </div>
      <h1>Welcome To ClassBuilder3D!</h1>
      <div className="logo">
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D" target="_blank" rel="noreferrer">
          <button style={{ backgroundColor: 'black', color: 'white', padding: '10px 40px', border: 'none', borderRadius: '20px', cursor: 'pointer', outline: "2px solid white" }}>Enter</button>
        </a>
      </div>
      <div className="card">
        <p>
          The Ultimate Class Scheduling Platform.
        </p>
      </div>
      <p className="credits">
        Built By Some People I Guess.
      </p>
    </div>
  );
}

export default App;