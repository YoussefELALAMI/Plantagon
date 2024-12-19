import React, { useState, useEffect } from "react";
import "./styles/plante.css";
import DataProviderComponent from "../components/DataProviderComponent";

interface PlantInfo {
  time: string; // Date in "YYYY-MM-DDThh:mm" format
  temp: number; // Temperature
  hygro: number; // Humidity
  lum: number; // Luminosity
}

const Plante: React.FC = () => {
  const [plantData, setPlantData] = useState<PlantInfo[]>([]); // Plant data
  const [percentage, setPercentage] = useState<number>(0);
  const [wateringStatus, setWateringStatus] = useState<string>("");

  /**
   * Analyze plant data and update watering status
   */
  const analyzeData = (data: PlantInfo[]) => {
    if (data.length === 0) {
      return;
    }
    const lastData = data[data.length - 1];
    const { hygro } = lastData;

    if (hygro < 50) {
      setWateringStatus("Water me please!");
      setPercentage(100 - hygro);
    } else {
      setWateringStatus("I'm good, thanks!");
      setPercentage(hygro);
    }
  };

  /**
   * Callback to receive data from DataProviderComponent
   */
  const handleDataFetched = (data: PlantInfo[]) => {
    setPlantData(data); // Update plant data
    analyzeData(data); // Analyze the data
  };

  const now = new Date();
  const startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 16); // Last month
  const endDate = now.toISOString().slice(0, 16); // Current time

  return (
    <div className="plante-container">
      <h1>Ma Plante</h1>
      <p>L'état courant de l'eau : {wateringStatus}</p>
      <p>Le taux d'humidité : {percentage}%</p>
      <p>Les données de la plante :</p>
      <ul>
        {plantData.map((data, index) => (
          <li key={index}>
            {data.time} - Temp: {data.temp}°C, Hygro: {data.hygro}%, Lum:{" "}
            {data.lum}%
          </li>
        ))}
      </ul>
      {/* Include DataProviderComponent for data fetching */}
      <DataProviderComponent
        startDate={startDate}
        endDate={endDate}
        onDataFetched={handleDataFetched}
      />
    </div>
  );
};

export default Plante;