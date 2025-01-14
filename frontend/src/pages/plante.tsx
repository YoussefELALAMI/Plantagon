import React, { useState } from "react";
import DataProviderComponent from "../components/DataProviderComponent";
import PlantAnimationComponent from "../components/PlantAnimationComponent";
import { PlantInfo } from "../types/PlantInfo";
import "./styles/plante.css";

const Plante: React.FC = () => {
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);

  return (
    <div className="plante-container">
      <h1>Ma Plante</h1>
      {plantInfo ? (
        <>
          <div className="absolute top-0 left-0 right-0 flex justify-around bg-white/80 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-icons text-red-500">
                device_thermostat
              </span>
              <span className="font-bold">{plantInfo.temp}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-500">water_drop</span>
              <span className="font-bold">{plantInfo.hygro}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-green-500">wb_grass</span>
              <span className="font-bold">{plantInfo.hum}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-yellow-500">wb_sunny</span>
              <span className="font-bold">{plantInfo.lum} lux</span>
            </div>
          </div>

          <PlantAnimationComponent plantInfo={plantInfo} />
        </>
      ) : (
        <p>Chargement des données de la plante...</p>
      )}

      <DataProviderComponent onDataFetched={setPlantInfo} />
    </div>
  );
};

export default Plante;
