import React from "react";
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
        <div className="navbar-logo"> Plantagon</div>
        <nav className="navbar-links">
            <a href="/plante" className="navbar-link">
              <span className="material-icons">eco</span> Ma Plante 
            </a>
            <a href="/stats" className="navbar-link">
              <span className="material-icons">bar_chart</span> Stats
            </a>
        </nav>
        <div className="navbar-buttons">
            <button className="navbar-button login-button">Connexion</button>
            <button className="navbar-button signup-button">Inscription</button>
        </div>
    </header>
  );
};

export default Navbar;