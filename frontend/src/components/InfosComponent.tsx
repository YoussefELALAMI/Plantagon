import React, { useState, useEffect, useContext } from "react";
import { PlantInfo } from "../types/PlantInfo";
import ChartsComponent from "./ChartsComponent";
import { PlantContext } from "../context/PlantContext";
import "./stats.css";
const baseURL = "http://192.168.1.15:5500";

/**
 * Component that fetches and displays plant information.
 */

const InfosComponent: React.FC = () => {
  const [infos, setInfos] = useState<PlantInfo[]>([]);
  const [startDate, setStartDate] = useState<string>(
    new Date("2025-01-01T00:00:00").toISOString().slice(0, -8)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date("2025-01-31T00:00:00").toISOString().slice(0, -8)
  );
  const context = useContext(PlantContext);

  if (!context) {
    throw new Error("Plante must be used within a PlantProvider");
  }

  const { selectedPlant } = context;

  useEffect(() => {
    console.log(startDate, endDate);
    console.log(selectedPlant);
    const fetchInfos = async () => {
      try {
        if (!startDate || !endDate) {
          console.error("Les dates de début et de fin doivent être définies");
          return;
        }

        const url = `http://${baseURL}/infos?plantId=${
          selectedPlant?.id
        }&f=${encodeURIComponent(startDate)}&t=${encodeURIComponent(endDate)}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        setInfos(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchInfos();
  }, [startDate, endDate]);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  return (
    <>
      <div className="dateSelector">
        <div>
          <label>Date de début: </label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label>Date de fin: </label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      <ChartsComponent infos={infos} />
    </>
  );
};

export default InfosComponent;
