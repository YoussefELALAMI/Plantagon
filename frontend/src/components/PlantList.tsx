import React, { useState } from 'react';
import { Plant } from '../types/Plant';
import './PlantList.css';

interface PlantListProps {
  plants: Plant[];
  onPlantSelect: (plant: Plant) => void;
  onAddPlant: (plant: Plant) => void;
}

const PlantList: React.FC<PlantListProps> = ({ plants, onPlantSelect, onAddPlant }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlant, setNewPlant] = useState<Plant>({
    id: '',
    name: '',
    type: '',
    reference_humidite: 0,
    reference_temperature: 0,
    reference_luminosite: 0,
    reference_humidite_sol: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5500/add-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlant),
      });
      
      if (response.ok) {
        const addedPlant = await response.json();
        onAddPlant(addedPlant);
        setNewPlant({id: '' , name: '', type: '', reference_humidite: 0, reference_temperature: 0, reference_luminosite: 0, reference_humidite_sol: 0});
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la plante:', error);
    }
  };

  return (
    <div className="plant-list-container">
      <div className="plant-grid">
        {plants.map((plant) => (
          <div 
            key={plant.id} 
            className="plant-card"
            onClick={() => onPlantSelect(plant)}
          >
            <h3>{plant.name}</h3>
            <p>Adresse IP : {plant.id}</p>
            <p>Type: {plant.type}</p>
          </div>
        ))}
        
        <div className="plant-card add-card" onClick={() => setShowAddForm(true)}>
          <span className="material-icons">add</span>
          <p>Ajouter une plante</p>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <h2>Ajouter une nouvelle plante</h2>
              <input
                type="text"
                placeholder="Adresse IP"
                value={newPlant.id}
                onChange={(e) => setNewPlant({...newPlant, id: e.target.value})}
              />
              <input
                type="text"
                placeholder="Nom de la plante"
                value={newPlant.name}
                onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Type de plante"
                value={newPlant.type}
                onChange={(e) => setNewPlant({...newPlant, type: e.target.value})}
              />
              <h4>Référence humidité </h4>
              <input
                type="text"
                placeholder="Référence humidité"
                value={newPlant.reference_humidite}
                onChange={(e) => setNewPlant({...newPlant, reference_humidite: Number(e.target.value)})}
              /> 
              <h4>Référence température </h4>
              <input
                type="text"
                placeholder="Référence température"
                value={newPlant.reference_temperature}
                onChange={(e) => setNewPlant({...newPlant, reference_temperature: Number(e.target.value)})}
              />
              <h4>Référence luminosité </h4>
              <input
                type="text"
                placeholder="Référence luminosité"
                value={newPlant.reference_luminosite}
                onChange={(e) => setNewPlant({...newPlant, reference_luminosite: Number(e.target.value)})}
              />
              <h4>Référence humidité sol </h4>
              <input
                type="text"
                placeholder="Référence humidité sol"
                value={newPlant.reference_humidite_sol}
                onChange={(e) => setNewPlant({...newPlant, reference_humidite_sol: Number(e.target.value)})}
              />
              <div className="button-group">
                <button type="submit">Ajouter</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantList;