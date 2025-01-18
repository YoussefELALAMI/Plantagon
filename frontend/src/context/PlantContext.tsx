import React, { createContext, useState, ReactNode } from "react";
import { Plant } from "../types/Plant";

interface PlantContextProps {
  selectedPlant: Plant | null;
  setSelectedPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
}

export const PlantContext = createContext<PlantContextProps | undefined>(undefined);

export const PlantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  return (
    <PlantContext.Provider value={{ selectedPlant, setSelectedPlant }}>
      {children}
    </PlantContext.Provider>
  );
};
