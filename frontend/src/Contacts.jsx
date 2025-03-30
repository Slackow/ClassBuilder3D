import './Contacts.css';
import Ryan from '../images/Ryan.jpg';
import Marvin from '../images/Marvin.jpg';
import Miller from '../images/Miller.jpg';
import Andrew from '../images/Andrew.jpg';

function Contacts() {
  return (
    <div className="fade-container">
      {/* Added heading for "Meet the Creators" */}
      <h2 className="creators-heading">Meet the Creators</h2>
      
      <div className="images-container">
        <div className="image-item">
          <img src={Ryan} alt="Ryan" />
          <p className="name">Ryan</p>
          <a
            className="social-link"
            href="https://www.linkedin.com/in/ryan-johnson-559b822b6/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="social-link"
            href="https://github.com/RJohnson2106"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <div className="image-item">
          <img src={Marvin} alt="Marvin" />
          <p className="name">Marvin</p>
          <a
            className="social-link"
            href="https://www.linkedin.com/in/marvinrm/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="social-link"
            href="https://github.com/marvinmody"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <div className="image-item">
          <img src={Miller} alt="Miller" />
          <p className="name">Miller</p>
          <a
            className="social-link"
            href="https://www.linkedin.com/in/miller-paule-b22b34331/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="social-link"
            href="https://github.com/pewpewpewman"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <div className="image-item">
          <img src={Andrew} alt="Andrew" />
          <p className="name">Andrew</p>
          <a
            className="social-link"
            href="https://www.linkedin.com/in/andrew-turcan/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="social-link"
            href="https://github.com/Slackow"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
      
      {/* Added subtitle "See their pages" */}
      <p className="pages-subtitle">See their pages above</p>
    </div>
  );
}

export default Contacts;