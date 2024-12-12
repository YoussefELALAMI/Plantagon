import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link  } from 'react-router-dom';
import './App.css';
import Plante from './pages/plante';
import Stats from './pages/stats';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/plante" element={<Plante />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;
