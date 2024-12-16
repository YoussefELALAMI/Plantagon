import React, { useState, useEffect } from "react";
import { data } from "react-router-dom";
import "./styles/plante.css";

interface PlantInfo {
  time: string; // Date in "YYYY-MM-DDThh:mm" format
  temp: number; // Temperature
  hygro: number; // Humidity
  lum: number; // Luminosity
}

const Plante: React.FC = () => {
  const [plantData, setPlantData] = useState<PlantInfo[]>([]); // Plant data as an array of PlantInfo objects
  const [percentage, setPercentage] = useState<number>(0);
  const [wateringStatus, setWateringStatus] = useState<string>("");

  /**
   * Function to fetch plant data from the server
   * @param startDate
   * @param endDate
   * @returns Data fetched from the server
   */
  const fetchPlantData = async (startDate: string, endDate: string) => {
    try {
      const response = await fetch(`/info?f=${startDate}&t=${endDate}`); // Fetch data from the server
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const jsonData: PlantInfo[] = await response.json(); // Parse JSON data
      setPlantData(jsonData); // Update plantData state
      return jsonData;
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return [];
    }
  };

  /**
   * Function to analyze plant data and update watering status
   * @param data
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
   * UseEffect hook to fetch plant data and analyze it
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const startDate = new Date(now.getTime() - 60 * 60 * 1000).toISOString(); // Last hour
      const endDate = now.toISOString(); // Current time

      fetchPlantData(startDate, endDate).then((data) => analyzeData(data));
    }, 500); // Fetch data every 500 ms

    return () => clearInterval(interval); // Cleanup
  }, []);

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
    </div>
  );
};

export default Plante;
