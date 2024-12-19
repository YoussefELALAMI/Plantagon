import React, { useState, useEffect } from "react";

interface Info {
  time: string;
  temp: number;
  hygro: number;
  lum: number;
}

interface DataProviderProps {
  startDate: string;
  endDate: string;
  onDataFetched: (infos: Info[]) => void; // Callback to send data to parent
}

const DataProviderComponent: React.FC<DataProviderProps> = ({ startDate, endDate, onDataFetched }) => {
  const [infos, setInfos] = useState<Info[]>([]);

  useEffect(() => {
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
        onDataFetched(data); // Pass the data to the parent component
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchInfos();
  }, [startDate, endDate, onDataFetched]);

  return null; // Don't render anything in this component
};

export default DataProviderComponent;