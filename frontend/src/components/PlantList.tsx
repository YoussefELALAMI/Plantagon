import React, { useState } from 'react';
import { Plant } from '../types/Plant';

interface PlantListProps {
  plants: Plant[];
  onPlantSelect: (plant: Plant) => void;
  onAddPlant: (plant: Plant) => void;
}

const PlantList: React.FC<PlantListProps> = ({ plants, onPlantSelect, onAddPlant }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlant, setNewPlant] = useState<Plant>({
    id: 0,
    name: '',
    type: '',
    reference: ''
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
        setNewPlant({id: 0 , name: '', type: '', reference: '' });
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
            <p>Type: {plant.type}</p>
            <p>Réf: {plant.reference}</p>
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
              <input
                type="text"
                placeholder="Référence"
                value={newPlant.reference}
                onChange={(e) => setNewPlant({...newPlant, reference: e.target.value})}
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