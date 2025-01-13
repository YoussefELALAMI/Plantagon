import React, { useState } from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-logo">Plantagon</div>
      <nav className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <a href="/plante" className="navbar-link">
          <span className="material-icons">eco</span> Ma Plante
        </a>
        <a href="/stats" className="navbar-link">
          <span className="material-icons">bar_chart</span> Stats
        </a>
        {/* Mobile Buttons */}
        <div className="mobile-buttons">
          <button className="navbar-button login-button">Connexion</button>
          <button className="navbar-button signup-button">Inscription</button>
        </div>
      </nav>
      {/* Desktop Buttons */}
      <div className="navbar-buttons">
        <button className="navbar-button login-button">Connexion</button>
        <button className="navbar-button signup-button">Inscription</button>
      </div>
      {/* Burger Menu */}
      <div
        className="burger-menu"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <div className="burger-icon"></div>
        <div className="burger-icon"></div>
        <div className="burger-icon"></div>
      </div>
    </header>
  );
};

export default Navbar;
