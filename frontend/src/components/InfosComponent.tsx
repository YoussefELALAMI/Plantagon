import React, { useState, useEffect } from "react";

interface Info {
  time: string;
  temp: number;
  hygro: number;
  lum: number;
}

const InfosComponent: React.FC = () => {
  const [infos, setInfos] = useState<Info[]>([]);
  const [startDate, setStartDate] = useState<string>(""); // Date de début
  const [endDate, setEndDate] = useState<string>(""); // Date de fin

  useEffect(() => {
    fetchInfos();
  }, [startDate, endDate]);

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
      // Gérer l'erreur (afficher un message à l'utilisateur, par exemple)
    }
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  return (
    <div>
      <h2>Informations</h2>
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
      <ul>
        {infos.map((info, index) => (
          <li key={index}>
            <strong>Time:</strong> {new Date(info.time).toLocaleString()} <br />
            <strong>Température:</strong> {info.temp} °C <br />
            <strong>Humidité:</strong> {info.hygro} % <br />
            <strong>Luminosité:</strong> {info.lum} lux
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfosComponent;
