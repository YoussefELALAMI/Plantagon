import React, { useContext, useState } from "react";
import { PlantContext } from "../context/PlantContext";
import { Link } from "react-router-dom";  // Utilisation de Link pour la navigation SPA
import "./Navbar.css";

const Navbar: React.FC = () => {
  const context = useContext(PlantContext);
  
  if (!context) {
    throw new Error("Plante must be used within a PlantProvider");
  }

  const { selectedPlant } = context;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">Plantagon</div>
      {selectedPlant && (
      <button className="burger-menu" onClick={toggleMenu}>
        <span className="material-icons">menu</span>
      </button>)}
      <nav className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        {selectedPlant && (
          <>
            <Link to="/plante" className="navbar-link">
              <span className="material-icons">eco</span> Ma Plante
            </Link>
            <Link to="/stats" className="navbar-link">
              <span className="material-icons">bar_chart</span> Stats
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
