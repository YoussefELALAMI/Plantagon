import React, { useState, useEffect } from "react";
import DataProviderComponent from "../components/DataProviderComponent";
import PlantAnimationComponent from "../components/PlantAnimationComponent";
import PlantList from "../components/PlantList";
import { PlantInfo } from "../types/PlantInfo";
import { Plant } from "../types/Plant";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlantContext } from "../context/PlantContext";
import "./styles/plante.css";

const Plante: React.FC = () => {
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);

  const navigate = useNavigate();
  const context = useContext(PlantContext);

  if (!context) {
    throw new Error("Plante must be used within a PlantProvider");
  }

  const { selectedPlant, setSelectedPlant } = context;

  useEffect(() => {
    // Charger la liste des plantes au démarrage
    const fetchPlants = async () => {
      try {
        const response = await fetch('http://localhost:5500/plants');
        if (response.ok) {
          const data = await response.json();
          setPlants(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plantes:', error);
      }
    };

    fetchPlants();
  }, []);

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
    navigate("/plante");
  };

  const handleAddPlant = (newPlant: Plant) => {
    setPlants([...plants, newPlant]);
  };

  const handleBackToList = () => {
    setSelectedPlant(null);
    navigate("/");  // Redirection vers la liste des plantes
  };

  return (
    <div className="plante-container">
      <h1>Mes Plantes</h1>
      
      {!selectedPlant ? (
        <PlantList 
          plants={plants}
          onPlantSelect={handlePlantSelect}
          onAddPlant={handleAddPlant}
        />
      ) : (
        <div className="selected-plant-view">
          <button 
            className="back-button"
            onClick={handleBackToList}
          >
            <span className="material-icons">arrow_back</span>
            Retour à la liste
          </button>
          
          {plantInfo && (
            <>
              <div className="plant-info-header">
                <h2>{selectedPlant.name}</h2>
                <p>Type: {selectedPlant.type}</p>
              </div>
              
              <div className="plant-metrics">
                <div className="metric-card">
                  <span className="material-icons">device_thermostat</span>
                  <span className="value">{plantInfo.temp}°C</span>
                </div>
                <div className="metric-card">
                  <span className="material-icons">water_drop</span>
                  <span className="value">{plantInfo.hygro}%</span>
                </div>
                <div className="metric-card">
                  <span className="material-icons">grass</span>
                  <span className="value">{plantInfo.hum}%</span>
                </div>
                <div className="metric-card">
                  <span className="material-icons">wb_sunny</span>
                  <span className="value">{plantInfo.lum} lux</span>
                </div>
              </div>
              
              <PlantAnimationComponent plantInfo={plantInfo} />
            </>
          )}
          <DataProviderComponent plantId={selectedPlant.id} onDataFetched={setPlantInfo} />
        </div>
      )}
    </div>
  );
};

export default Plante;
