import React, { useEffect } from "react";
import { PlantInfo } from "../types/PlantInfo";
const baseURL = process.env.REACT_APP_BACKEND_URL;

interface DataProviderProps {
  onDataFetched: (info: PlantInfo) => void;
}

const DataProviderComponent: React.FC<DataProviderProps> = ({
  onDataFetched,
}) => {
  useEffect(() => {
    const fetchLastData = async () => {
      try {
        console.log(baseURL);
        const response = await fetch(`${baseURL}/last-info`); // Appelle l'endpoint backend
        if (!response.ok) throw new Error("Failed to fetch last plant data");

        const data: PlantInfo = await response.json();
        onDataFetched(data); // Passe la dernière donnée au parent
      } catch (error) {
        console.error("Error fetching last plant data:", error);
      }
    };

    fetchLastData();
  }, [onDataFetched]);

  return null;
};

export default DataProviderComponent;
