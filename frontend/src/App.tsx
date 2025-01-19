import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Plante from "./pages/plante";
import Stats from "./pages/stats";
import Navbar from "./components/Navbar";
import { PlantProvider } from "./context/PlantContext"; // Importez le PlantProvider

function App() {
  return (
    <PlantProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Plante />} />
          <Route path="/plante" element={<Plante />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Router>
    </PlantProvider>
  );
}

export default App;
