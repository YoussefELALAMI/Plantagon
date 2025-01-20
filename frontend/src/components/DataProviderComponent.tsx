import React, { useEffect } from "react";
import { PlantInfo } from "../types/PlantInfo";
import { Plant } from "../types/Plant";
const baseURL = "192.168.1.15:5500";
import {IP_ADRESS} from "../../../config";


interface DataProviderProps {
  plantId: string;
  onDataFetched: (plantInfo: PlantInfo, plantDetails: Plant) => void;
}

const DataProviderComponent: React.FC<DataProviderProps> = ({
  plantId,
  onDataFetched,
}) => {
  useEffect(() => {
    const fetchLastData = async () => {
      try {
        const response = await fetch(`http://${IP_ADRESS}:5500/plants`); // D'abord, récupérons les informations de base de la plante
        if (!response.ok)
          throw new Error(
            "Impossible de récupérer les informations des plantes"
          );

        const plants: Plant[] = await response.json();

        // On trouve la plante spécifique dans la liste
        const plantDetails = plants.find((plant) => plant.id === plantId);
        if (!plantDetails) {
          throw new Error(`Plante avec l'ID ${plantId} non trouvée`);
        }

        // Ensuite, on récupère les dernières données des capteurs
        const sensorResponse = await fetch(
          `http://${IP_ADRESS}:5500/last-info?plantId=${plantId}`
            //`http://192.168.1.15:5500/last-info?plantId=${plantId}`
 
        );
        if (!sensorResponse.ok) {
          throw new Error("Impossible de récupérer les données des capteurs");
        }
        const sensorData: PlantInfo = await sensorResponse.json();

        onDataFetched(sensorData, plantDetails); // Passe la dernière donnée au parent
      } catch (error) {
        console.error("Error fetching last plant data:", error);
      }
    };

    fetchLastData();
  }, [plantId, onDataFetched]);

  return null;
};

export default DataProviderComponent;
