import React, { useState, useEffect } from "react";
import { PlantInfo } from "../types/PlantInfo";
import ChartsComponent from "./ChartsComponent";
import "./stats.css";

/**
 * Component that fetches and displays plant information.
 */

const InfosComponent: React.FC = () => {
  const [infos, setInfos] = useState<PlantInfo[]>([]);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, -8)
  ); // Date de début
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().slice(0, -8)
  ); // Date de fin

  useEffect(() => {
    console.log(startDate, endDate);
    const fetchInfos = async () => {
      try {
        if (!startDate || !endDate) {
          console.error("Les dates de début et de fin doivent être définies");
          return;
        }

        const url = `http://localhost:5500/infos?f=${encodeURIComponent(
          startDate
        )}&t=${encodeURIComponent(endDate)}`;
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
      <h2>Informations</h2>
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
